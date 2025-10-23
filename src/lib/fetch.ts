import { CONFIG } from './config';
import { logger } from './logger';

function normalizeFullWidthCharacters(text: string): string {
  return text
    .replace(/[\uFF01-\uFF5E]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
    .replace(/\u3000/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly url?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

async function fetchWithNative(url: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  const fetchLogger = logger.operation('fetch');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new HttpError(response.status, `HTTP ${response.status}: ${response.statusText}`, url);
    }

    return response;
  } catch (error) {
    fetchLogger.error(`Fetch failed: ${url}`, error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new HttpError(408, 'Request timeout', url);
    }
    throw new HttpError(500, `Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`, url);
  }
}

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit & {
    timeout?: number;
    retries?: number;
    baseDelay?: number;
    parser?: (response: Response) => Promise<T>;
  } = {},
): Promise<T> {
  const {
    retries = CONFIG.HTTP.RETRY.COUNT,
    baseDelay = CONFIG.HTTP.RETRY.BASE_DELAY,
    parser = (response) => response.json() as Promise<T>,
    ...fetchOptions
  } = options;

  const retryLogger = logger.operation('fetch-retry');
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * 2 ** (attempt - 1);
        retryLogger.warn(`Retry ${attempt}/${retries} after ${delay}ms`, { url });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      const response = await fetchWithNative(url, fetchOptions);
      return await parser(response);
    } catch (error) {
      lastError = error as Error;

      if (!(error instanceof HttpError && [408, 429, 500, 502, 503, 504].includes(error.status))) {
        throw error;
      }
    }
  }

  retryLogger.error(`All retries failed for ${url}`);
  throw lastError || new Error(`Failed to fetch ${url} after ${retries + 1} attempts`);
}

export { normalizeFullWidthCharacters };
