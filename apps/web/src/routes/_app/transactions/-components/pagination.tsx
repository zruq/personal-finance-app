import RightArrowIcon from '@personal-finance-app/ui/icons/arrow-right.icon';
import { Link } from '@tanstack/react-router';
import type { RouterOutputs } from '@personal-finance-app/api/server';
import { classNames } from '@personal-finance-app/ui/lib/utils';

export default function Pagination({
  currentPage,
  totalPages,
}: RouterOutputs['transactions']['many']['meta']) {
  return (
    <div className="flex justify-between items-center gap-4">
      <Link
        to={'/transactions'}
        search={(prev) => ({ ...prev, page: currentPage - 1 })}
        disabled={currentPage === 1}
        className={classNames(
          'fill-grey-500 flex items-center  gap-x-2 px-5 py-2 text-preset-4 text-grey-900 border-beige-500 border rounded-lg',
          currentPage === 1
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-beige-500 hover:text-white hover:fill-white',
        )}
      >
        <RightArrowIcon className="rotate-180 size-4 sm:-translate-x-0.5" />
        <span className="hidden sm:inline">Prev</span>
      </Link>

      <div className="flex items-center gap-2">
        {totalPages <= 6 ? (
          range(1, totalPages).map((page) => (
            <PageLink key={page} page={page} currentPage={currentPage} />
          ))
        ) : currentPage <= 2 || totalPages - currentPage < 2 ? (
          <>
            {range(1, 3).map((page) => (
              <PageLink key={page} page={page} currentPage={currentPage} />
            ))}
            <span className="size-10 flex items-center justify-center rounded-lg text-preset-4 transition duration-300 text-grey-900  border border-beige-500 bg-white">
              ...
            </span>
            {range(totalPages - 2, totalPages).map((page) => (
              <PageLink key={page} page={page} currentPage={currentPage} />
            ))}
          </>
        ) : (
          <>
            <PageLink page={1} currentPage={currentPage} />
            <span className="size-10 flex items-center justify-center rounded-lg text-preset-4 transition duration-300 text-grey-900  border border-beige-500 bg-white">
              ...
            </span>
            {range(currentPage - 1, currentPage + 1).map((page) => (
              <PageLink key={page} page={page} currentPage={currentPage} />
            ))}
            <span className="size-10 flex items-center justify-center rounded-lg text-preset-4 transition duration-300 text-grey-900  border border-beige-500 bg-white">
              ...
            </span>
            <PageLink page={totalPages} currentPage={currentPage} />
          </>
        )}
      </div>

      <Link
        to={'/transactions'}
        search={(prev) => ({ ...prev, page: currentPage + 1 })}
        disabled={currentPage === totalPages}
        className={classNames(
          'fill-grey-500 flex items-center gap-x-2 px-5 py-2 text-preset-4 text-grey-900 border-beige-500 border rounded-lg',
          currentPage === totalPages
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-beige-500 hover:text-white hover:fill-white',
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <RightArrowIcon className="size-4 sm:translate-x-0.5" />
      </Link>
    </div>
  );
}

function PageLink({
  currentPage,
  page,
}: {
  page: number;
  currentPage: number;
}) {
  return (
    <Link
      to={'/transactions'}
      search={(prev) => ({ ...prev, page })}
      className={classNames(
        'size-10 flex items-center justify-center rounded-lg text-preset-4 transition duration-300',
        page === currentPage
          ? 'bg-grey-900 text-white'
          : 'text-grey-900 hover:bg-beige-500 border border-beige-500 bg-white hover:text-white',
      )}
    >
      {page}
    </Link>
  );
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
