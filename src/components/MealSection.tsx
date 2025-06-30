import Glass from '@/components/Glass';
import type { MealSectionProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export function MealSection({
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

          <div className="flex flex-col gap-2 pr-2">
            {!isLoading && imageUrl && !isError && (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-semibold">-</p>
                <Link
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[20px] font-semibold underline active:scale-95 active:opacity-50 duration-100">
                  사진 보기
                </Link>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-row gap-2" />
            ) : isError ? (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-semibold">{errorMessage || '급식 정보가 없어요'}</p>
              </div>
            ) : displayItems.length > 0 ? (
              displayItems.map((item, index) => (
                <div key={`${title.toLowerCase()}-${index}`} className="flex flex-row gap-2">
                  <p className="text-[20px] font-semibold">-</p>
                  <Link
                    className="active:scale-95 active:opacity-50 duration-100"
                    target="_blank"
                    rel="noreferrer noopener"
                    href={`https://search.naver.com/search.naver?ssc=tab.image.all&where=image&sm=tab_jum&query=${item}`}>
                    <p className="text-[20px] font-semibold break-words">{item}</p>
                  </Link>
                </div>
              ))
            ) : isMealOperationEmpty ? (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-semibold">급식 운영이 없어요</p>
              </div>
            ) : isSimpleMealMode && id !== 'lunch' ? (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-semibold">간편식이 없어요</p>
              </div>
            ) : (
              <div className="flex flex-row gap-2">
                <p className="text-[20px] font-semibold">급식 정보가 없어요</p>
              </div>
            )}
          </div>
        </>
      )}
    </Glass>
  );
}
