import * as cheerio from 'cheerio';
import { CONFIG } from './config';
import type { CafeteriaData, MenuPost, ProcessedMealMenu } from './types';
import { formatDate } from './date';
import { fetchWithRetry } from './fetch';
import { logger } from './logger';
import { mongoDB } from './mongodb';

function calculateMenuDate(title: string, registrationDateStr: string): Date | null {
  const monthDayMatch = title.match(/(\d{1,2})월\s*(\d{1,2})일/);
  if (!monthDayMatch) return null;

  const menuMonth = parseInt(monthDayMatch[1]);
  const menuDay = parseInt(monthDayMatch[2]);

  const registrationDate = new Date(registrationDateStr);
  const registrationYear = registrationDate.getFullYear();
  const registrationMonth = registrationDate.getMonth() + 1;

  let menuYear = registrationYear;

  if (registrationMonth === 12 && menuMonth === 1) {
    menuYear = registrationYear + 1;
  }
  else if (registrationMonth === 1 && menuMonth === 12) {
    menuYear = registrationYear - 1;
  }

  return new Date(menuYear, menuMonth - 1, menuDay);
}

export async function getLatestMenuPosts(): Promise<MenuPost[]> {
  const timer = logger.time();
  const allPosts: MenuPost[] = [];

  try {
    for (let page = CONFIG.WEBSITE.PAGE_RANGE.START; page <= CONFIG.WEBSITE.PAGE_RANGE.END; page++) {
      const url = `${CONFIG.WEBSITE.BASE_URL}?mid=${CONFIG.WEBSITE.CAFETERIA_PATH}&page=${page}`;

      const html = await fetchWithRetry<string>(url, {
        parser: async (response) => response.text(),
      });

      const $ = cheerio.load(html);
      const posts = $('.scContent tbody tr')
        .map((_, row) => {
          const linkElement = $(row).find('.scEllipsis a');
          const link = linkElement.attr('href');
          const documentId = link?.match(/document_srl=(\d+)/)?.[1];
          if (!documentId) return null;

          const title = linkElement.text().trim();
          if (!title.includes('식단')) return null;

          const registrationDate = $(row).find('td:nth-child(5)').text().trim();

          const menuDate = calculateMenuDate(title, registrationDate);
          if (!menuDate) return null;

          return {
            documentId,
            title,
            date: formatDate(menuDate),
            registrationDate,
            parsedDate: menuDate,
          };
        })
        .get()
        .filter((post): post is MenuPost & { parsedDate: Date } => post !== null);

      allPosts.push(...posts);
      logger.info(`Fetched ${posts.length} menu posts from page ${page}`);
    }

    timer(`Fetched total ${allPosts.length} menu posts from pages ${CONFIG.WEBSITE.PAGE_RANGE.START}-${CONFIG.WEBSITE.PAGE_RANGE.END}`);
    return allPosts;
  } catch (error) {
    logger.error('Failed to fetch menu posts', error);
    throw error;
  }
}

function findMenuPostForDate(menuPosts: MenuPost[], dateParam: string): MenuPost | undefined {
  const targetDate = new Date(dateParam);
  const targetDateStr = formatDate(targetDate);

  return menuPosts.find((post) => {
    return post.date === targetDateStr;
  });
}

const parseMenu = (menuStr: string): string[] => {
  if (!menuStr) return [];

  const items: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < menuStr.length; i++) {
    const char = menuStr[i];

    if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth = Math.max(0, parenDepth - 1);
      current += char;
    } else if (char === '/' && parenDepth === 0) {
      if (current.trim()) {
        items.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  return items;
};

async function getMealData(documentId: string, dateKey: string): Promise<CafeteriaData> {
  const mealLogger = logger.operation('parse-meal', dateKey);
  const timer = mealLogger.time();

  try {
    const url = `${CONFIG.WEBSITE.BASE_URL}?mid=${CONFIG.WEBSITE.CAFETERIA_PATH}&document_srl=${documentId}`;

    const html = await fetchWithRetry<string>(url, {
      parser: async (response) => response.text(),
    });

    const $ = cheerio.load(html);
    const contentLines = $('.xe_content')
      .text()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const processedMenu: ProcessedMealMenu = {
      breakfast: { regular: [], simple: [], image: '' },
      lunch: { regular: [], simple: [], image: '' },
      dinner: { regular: [], simple: [], image: '' },
    };

    const parseMealSection = (lines: string[], startIndex: number, mealType: string) => {
      const mealLine = lines[startIndex];
      const mealText = mealLine.replace(`*${mealType}:`, '').trim();

      const regular = parseMenu(mealText);
      let simple: string[] = [];

      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('*조식:') || line.startsWith('*중식:') || line.startsWith('*석식:')) {
          break;
        }

        if (/^<간편식>\s*/.test(line)) {
          const simpleMealText = line.replace(/^<간편식>\s*/, '').trim();
          simple = parseMenu(simpleMealText);
        }

        if (simple.length > 0 || line === '') {
          continue;
        }
        break;
      }

      return { regular, simple };
    };

    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i];

      if (line.startsWith(`*${CONFIG.MEAL_TYPES.BREAKFAST}:`)) {
        const { regular, simple } = parseMealSection(contentLines, i, CONFIG.MEAL_TYPES.BREAKFAST);
        processedMenu.breakfast.regular = regular;
        processedMenu.breakfast.simple = simple;
      } else if (line.startsWith(`*${CONFIG.MEAL_TYPES.LUNCH}:`)) {
        const { regular, simple } = parseMealSection(contentLines, i, CONFIG.MEAL_TYPES.LUNCH);
        processedMenu.lunch.regular = regular;
        processedMenu.lunch.simple = simple;
      } else if (line.startsWith(`*${CONFIG.MEAL_TYPES.DINNER}:`)) {
        const { regular, simple } = parseMealSection(contentLines, i, CONFIG.MEAL_TYPES.DINNER);
        processedMenu.dinner.regular = regular;
        processedMenu.dinner.simple = simple;
      }
    }

    $('.xe_content img').each((_, element) => {
      const imgSrc = $(element).attr('src');
      const imgAlt = $(element).attr('alt')?.toLowerCase() || '';

      if (imgSrc) {
        const fullUrl = new URL(imgSrc, 'https://www.dimigo.hs.kr').toString();
        if (imgAlt.includes('조')) processedMenu.breakfast.image = fullUrl;
        else if (imgAlt.includes('중')) processedMenu.lunch.image = fullUrl;
        else if (imgAlt.includes('석')) processedMenu.dinner.image = fullUrl;
      }
    });

    const result: CafeteriaData = {
      breakfast: processedMenu.breakfast,
      lunch: processedMenu.lunch,
      dinner: processedMenu.dinner,
    };

    const isAllMealsEmpty =
      processedMenu.breakfast.regular.length === 0 &&
      processedMenu.breakfast.simple.length === 0 &&
      processedMenu.lunch.regular.length === 0 &&
      processedMenu.lunch.simple.length === 0 &&
      processedMenu.dinner.regular.length === 0 &&
      processedMenu.dinner.simple.length === 0;

    if (isAllMealsEmpty) {
      const existingData = await mongoDB.getMealData(dateKey);
      if (existingData) {
        mealLogger.info('All meals are empty, preserving existing data');
        timer('Preserved existing meal data (empty refresh result)');
        return existingData;
      }
    }

    await mongoDB.saveMealData(dateKey, result, documentId);
    timer('Parsed and saved meal data');

    return result;
  } catch (error) {
    logger.error(`Failed to get meal data for ${dateKey}`, error);
    throw error;
  }
}

export async function getCafeteriaData(dateParam: string): Promise<CafeteriaData> {
  const cachedData = await mongoDB.getMealData(dateParam);
  if (cachedData) {
    return cachedData;
  }

  const { earliest, latest } = await mongoDB.getDateRange();

  if (!earliest || !latest) {
    throw new Error('NO_INFORMATION');
  }

  const targetDate = new Date(dateParam);
  const earliestDate = new Date(earliest);
  const latestDate = new Date(latest);

  if (targetDate < earliestDate || targetDate > latestDate) {
    throw new Error('NO_INFORMATION');
  }

  throw new Error('NO_OPERATION');
}

export async function fetchAndSaveCafeteriaData(dateParam: string, menuPosts: MenuPost[]): Promise<CafeteriaData> {
  const targetPost = findMenuPostForDate(menuPosts, dateParam);

  if (!targetPost) {
    const targetDate = new Date(dateParam);

    const postDates = menuPosts
      .map((post) => new Date(post.date))
      .filter((date): date is Date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (postDates.length === 0) {
      throw new Error('NO_INFORMATION');
    }

    const earliestDate = postDates[0];
    const latestDate = postDates[postDates.length - 1];

    if (targetDate < earliestDate || targetDate > latestDate) {
      throw new Error('NO_INFORMATION');
    }

    throw new Error('NO_OPERATION');
  }

  return await getMealData(targetPost.documentId, dateParam);
}

export async function refreshSpecificDate(dateParam: string): Promise<CafeteriaData> {
  const documentId = await mongoDB.getDocumentId(dateParam);

  if (!documentId) {
    throw new Error('NO_INFORMATION');
  }

  return await getMealData(documentId, dateParam);
}

export async function refreshCafeteriaData(refreshType: 'today' | 'all' = 'all'): Promise<void> {
  const refreshLogger = logger.operation('refresh');
  const timer = refreshLogger.time();

  try {
    refreshLogger.info(`Starting cafeteria data refresh (${refreshType})`);

    const menuPosts = await getLatestMenuPosts();
    let successCount = 0;
    let errorCount = 0;

    for (const post of menuPosts) {
      try {
        const postDate = new Date(post.date);
        if (isNaN(postDate.getTime())) {
          refreshLogger.warn(`Invalid date: ${post.date} for ${post.title}`);
          continue;
        }

        if (refreshType === 'today') {
          const today = new Date();
          const isToday = postDate.getDate() === today.getDate() &&
                         postDate.getMonth() === today.getMonth() &&
                         postDate.getFullYear() === today.getFullYear();

          if (!isToday) {
            continue;
          }
        }

        const dateKey = formatDate(postDate);
        refreshLogger.info(`Processing ${dateKey}`);
        await fetchAndSaveCafeteriaData(dateKey, menuPosts);
        refreshLogger.info(`✓ Completed ${dateKey}`);
        successCount++;
      } catch (error) {
        errorCount++;
        refreshLogger.error(`✗ Failed ${post.title}`, error);
      }
    }

    timer(`Refresh completed (${refreshType}): ${successCount} success, ${errorCount} errors`);
  } catch (error) {
    refreshLogger.error('Cafeteria refresh failed', error);
    throw error;
  }
}
