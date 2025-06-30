import Glass from '@/components/Glass';
import { CONFIG } from '@/config';
import type { MealSectionProps } from '@/types';
import { componentLogger } from '@/utils/logger';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback } from 'react';

const logger = componentLogger('MealSection');

const MealItem = memo(({ item, title }: { item: string; title: string }) => {
  const handleClick = useCallback(() => {
    logger.action('mealItemClick', { meal: title.toLowerCase(), item });
  }, [item, title]);

  return (
    <div className="flex flex-row gap-2">
      <p className="text-[20px] font-semibold">-</p>
      <Link
        className="active:scale-95 active:opacity-50 duration-100"
        target="_blank"
        rel="noreferrer noopener"
        href={`${CONFIG.SEARCH.NAVER_URL}?${CONFIG.SEARCH.SEARCH_PARAMS}${encodeURIComponent(item)}`}
        onClick={handleClick}>
        <p className="text-[20px] font-semibold break-words">{item}</p>
      </Link>
    </div>
  );
});

MealItem.displayName = 'MealItem';

const ImageLink = memo(({ url, title }: { url: string; title: string }) => {
  const handleClick = useCallback(() => {
    logger.action('mealImageClick', { meal: title.toLowerCase() });
  }, [title]);

  return (
    <div className="flex flex-row gap-2">
      <p className="text-[20px] font-semibold">-</p>
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[20px] font-semibold underline active:scale-95 active:opacity-50 duration-100"
        onClick={handleClick}>
        사진 보기
      </Link>
    </div>
  );
});

ImageLink.displayName = 'ImageLink';

export const MealSection = memo(function MealSection({
  icon,
  title,
  regularItems,
  simpleMealItems,
  imageUrl,
  isLoading,
  isError = false,
  errorMessage,
  id,
  showContent,
  isSimpleMealMode = false,
}: MealSectionProps & { errorMessage?: string }) {
  const displayItems = id === 'lunch' ? regularItems : isSimpleMealMode ? simpleMealItems : regularItems;

  const isMealOperationEmpty =
    Array.isArray(regularItems) &&
    Array.isArray(simpleMealItems) &&
    regularItems.length === 0 &&
    simpleMealItems.length === 0;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          logger.debug('Meal section visible', { meal: id });
        }
      }
    },
    [id],
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex flex-row gap-2" />;
    }

    if (isError) {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">{errorMessage || '급식 정보가 없어요'}</p>
        </div>
      );
    }

    if (displayItems.length > 0) {
      return (
        <>
          {imageUrl && <ImageLink url={imageUrl} title={title} />}
          {displayItems.map((item, index) => (
            <MealItem key={`${title.toLowerCase()}-${index}`} item={item} title={title} />
          ))}
        </>
      );
    }

    if (isMealOperationEmpty) {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">급식 운영이 없어요</p>
        </div>
      );
    }

    if (isSimpleMealMode && id !== 'lunch') {
      return (
        <div className="flex flex-row gap-2">
          <p className="text-[20px] font-semibold">간편식이 없어요</p>
        </div>
      );
    }

    return (
      <div className="flex flex-row gap-2">
        <p className="text-[20px] font-semibold">급식 정보가 없어요</p>
      </div>
    );
  };

  return (
    <Glass
      className="flex-shrink-0 w-full md:flex-1 snap-center snap-always p-4 flex flex-col gap-4 overflow-y-auto"
      data-id={id}>
      {showContent && (
        <>
          <div className="flex flex-row gap-2 items-center h-8">
            <Image
              className="filter-drop-shadow"
              src={icon}
              alt={title}
              width={32}
              height={32}
              style={{ filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))' }}
              draggable={false}
            />
            <p className="text-[32px] font-bold tracking-tight">{title}</p>
          </div>

          <div className="flex flex-col gap-2 pr-2">{renderContent()}</div>
        </>
      )}
    </Glass>
  );
});
