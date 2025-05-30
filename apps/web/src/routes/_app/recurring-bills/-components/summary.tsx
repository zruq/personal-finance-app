import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { useSuspenseQuery } from '@tanstack/react-query';
import { trpc } from '@/router';

export default function Summary() {
  const { data: summary } = useSuspenseQuery(trpc.bills.summary.queryOptions());

  return (
    <div className="min-md:max-xl:grid min-md:max-xl:grid-cols-2 min-md:max-xl:gap-x-6 xl:block space-y-6 xl:w-[337px]">
      <div className="max-md:flex max-md:items-center max-md:gap-x-5 px-5 py-6 min-md:max-xl:h-full bg-grey-900 text-white md:p-6 md:space-y-8 rounded-xl">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.4375 16.25C28.4375 16.4986 28.3387 16.7371 28.1629 16.9129C27.9871 17.0887 27.7486 17.1875 27.5 17.1875H12.5C12.2514 17.1875 12.0129 17.0887 11.8371 16.9129C11.6613 16.7371 11.5625 16.4986 11.5625 16.25C11.5625 16.0014 11.6613 15.7629 11.8371 15.5871C12.0129 15.4113 12.2514 15.3125 12.5 15.3125H27.5C27.7486 15.3125 27.9871 15.4113 28.1629 15.5871C28.3387 15.7629 28.4375 16.0014 28.4375 16.25ZM27.5 20.3125H12.5C12.2514 20.3125 12.0129 20.4113 11.8371 20.5871C11.6613 20.7629 11.5625 21.0014 11.5625 21.25C11.5625 21.4986 11.6613 21.7371 11.8371 21.9129C12.0129 22.0887 12.2514 22.1875 12.5 22.1875H27.5C27.7486 22.1875 27.9871 22.0887 28.1629 21.9129C28.3387 21.7371 28.4375 21.4986 28.4375 21.25C28.4375 21.0014 28.3387 20.7629 28.1629 20.5871C27.9871 20.4113 27.7486 20.3125 27.5 20.3125ZM35.9375 8.75V32.5C35.9373 32.6598 35.8963 32.8168 35.8184 32.9563C35.7404 33.0958 35.6282 33.213 35.4922 33.2969C35.3446 33.389 35.174 33.4378 35 33.4375C34.8547 33.4376 34.7113 33.4039 34.5813 33.3391L30 31.0484L25.4187 33.3391C25.2887 33.404 25.1453 33.4378 25 33.4378C24.8547 33.4378 24.7113 33.404 24.5813 33.3391L20 31.0484L15.4187 33.3391C15.2887 33.404 15.1453 33.4378 15 33.4378C14.8547 33.4378 14.7113 33.404 14.5813 33.3391L10 31.0484L5.41875 33.3391C5.2758 33.4104 5.11697 33.4441 4.95736 33.4368C4.79775 33.4295 4.64264 33.3816 4.50676 33.2975C4.37089 33.2135 4.25875 33.0961 4.18099 32.9565C4.10324 32.8169 4.06245 32.6598 4.0625 32.5V8.75C4.0625 8.16984 4.29297 7.61344 4.7032 7.2032C5.11344 6.79297 5.66984 6.5625 6.25 6.5625H33.75C34.3302 6.5625 34.8866 6.79297 35.2968 7.2032C35.707 7.61344 35.9375 8.16984 35.9375 8.75ZM34.0625 8.75C34.0625 8.66712 34.0296 8.58763 33.971 8.52903C33.9124 8.47042 33.8329 8.4375 33.75 8.4375H6.25C6.16712 8.4375 6.08763 8.47042 6.02903 8.52903C5.97042 8.58763 5.9375 8.66712 5.9375 8.75V30.9828L9.58125 29.1609C9.71129 29.096 9.85465 29.0622 10 29.0622C10.1453 29.0622 10.2887 29.096 10.4187 29.1609L15 31.4516L19.5813 29.1609C19.7113 29.096 19.8547 29.0622 20 29.0622C20.1453 29.0622 20.2887 29.096 20.4187 29.1609L25 31.4516L29.5813 29.1609C29.7113 29.096 29.8547 29.0622 30 29.0622C30.1453 29.0622 30.2887 29.096 30.4187 29.1609L34.0625 30.9828V8.75Z"
            fill="white"
          />
        </svg>
        <div className="space-y-3">
          <h2 className="text-preset-4">Total Bills</h2>
          <p className="text-preset-1">
            {formatCurrency(summary.paid.sum + summary.unpaid.sum)}
          </p>
        </div>
      </div>
      <div className="bg-white p-5 space-y-5 rounded-xl">
        <h3 className="text-grey-900 text-preset-3">Summary</h3>
        <div className="space-y-4">
          <div className="pb-4 border-[#696868]/15 border-b flex justify-between items-center">
            <p className="text-preset-5 text-grey-500">Paid Bills</p>
            <p className="text-preset-5 font-bold text-grey-900">
              {summary.paid.count} ({formatCurrency(summary.paid.sum)})
            </p>
          </div>
          <div className="pb-4 border-[#696868]/15 border-b flex justify-between items-center">
            <p className="text-preset-5 text-grey-500">Total Upcoming</p>
            <p className="text-preset-5 font-bold text-grey-900">
              {summary.unpaid.count} ({formatCurrency(summary.unpaid.sum)})
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-preset-5 text-red">Due Soon</p>
            <p className="text-preset-5 font-bold text-red">
              {summary.duesoon.count} ({formatCurrency(summary.duesoon.sum)})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
