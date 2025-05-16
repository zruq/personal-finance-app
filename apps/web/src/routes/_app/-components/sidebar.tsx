import { classNames } from '@personal-finance-app/ui/lib/utils';
import { Link, type LinkProps } from '@tanstack/react-router';
import React, { useState } from 'react';
import ArrowLeftIcon from '../-icons/arrow-left.icon';
import ArrowUpDownIcon from '../-icons/arrow-up-down.icon';
import HalfTicketIcon from '../-icons/half-ticket.icon';
import HomeIcon from '../-icons/home.icon';
import PieChartIcon from '../-icons/pie-chart.icon';
import PotIcon from '../-icons/pot.icon';

const SIDEBAR_ITEMS: Array<{
  name: string;
  to: LinkProps['to'];
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}> = [
  {
    name: 'Home',
    icon: HomeIcon,
    to: '/',
  },
  {
    name: 'Transactions',
    icon: ArrowUpDownIcon,
    to: '/transactions',
  },
  {
    name: 'Budgets',
    icon: PieChartIcon,
    to: '/budgets',
  },
  {
    name: 'Pots',
    icon: PotIcon,
    to: '/pots',
  },
  {
    name: 'Recurring Bills',
    icon: HalfTicketIcon,
    to: '/recurring-bills',
  },
];

export const Sidebar = () => {
  return (
    <>
      <SidebarMobileTablet />
      <SidebarDesktop />
    </>
  );
};

export const SidebarMobileTablet = () => {
  return (
    <ul className="bg-grey-900 rounded-t-lg flex max-w-dvw items-center justify-between overflow-x-auto px-4 pt-2 md:px-10 xl:hidden">
      {SIDEBAR_ITEMS.map((item) => (
        <li key={item.name} className="w-full">
          <Link to={item.to}>
            {({ isActive }) => (
              <div
                className={classNames(
                  'group text-grey-300 rounded-t-lg border-grey-900 flex flex-col items-center border-b-4 px-[1.39rem] py-2 hover:text-white md:px-10',
                  {
                    'bg-beige-100 border-green text-grey-900 hover:text-grey-900':
                      isActive,
                  },
                )}
              >
                <item.icon
                  className={classNames(
                    'fill-grey-300 size-6 group-hover:fill-white',
                    {
                      'fill-green group-hover:fill-green': isActive,
                    },
                  )}
                />
                <span className="text-preset-5 sr-only text-center font-bold md:not-sr-only md:pt-1">
                  {item.name}
                </span>
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const SidebarDesktop = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  return (
    <div
      className={classNames(
        'bg-grey-900 rounded-r-2xl hidden h-full w-[18.75rem] px-8 pt-10 pb-6 xl:block',
        { 'w-[5.5rem] pr-2': isMinimized },
      )}
    >
      {isMinimized ? (
        <img src="/logo-minimized.svg" alt="finance" className="" />
      ) : (
        <img
          src="/logo.svg"
          alt="finance"
          className="h-[21.76px] w-[121.45px]"
        />
      )}
      <div className="flex h-full flex-col justify-between pt-16">
        <ul className="flex-1">
          {SIDEBAR_ITEMS.map((item) => {
            return (
              <li key={item.name} className="-ml-8">
                <Link to={item.to}>
                  {({ isActive }) => (
                    <div
                      className={classNames(
                        'group border-grey-900 text-grey-300 flex gap-x-4 border-l-4 py-4 pl-8 hover:text-white',
                        {
                          'rounded-r-xl border-green text-grey-900 hover:text-grey-900 bg-white':
                            isActive,
                          'pl-0': isMinimized,
                        },
                      )}
                    >
                      <item.icon
                        className={classNames(
                          'fill-grey-300 size-6 group-hover:fill-white',
                          {
                            'fill-green group-hover:fill-green': isActive,
                            'flex-1': isMinimized,
                          },
                        )}
                      />
                      <span
                        className={classNames('text-preset-3', {
                          'sr-only': isMinimized,
                        })}
                      >
                        {item.name}
                      </span>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => setIsMinimized((v) => !v)}
          className="group text-preset-3 text-grey-300 flex cursor-pointer items-center gap-x-4 pb-16 hover:text-white"
        >
          <ArrowLeftIcon
            className={classNames(
              'fill-grey-300 size-6 group-hover:fill-white',
              { 'rotate-180': isMinimized },
            )}
          />
          <span className={classNames({ 'sr-only': isMinimized })}>
            Minimize Menu
          </span>
        </button>
      </div>
    </div>
  );
};
