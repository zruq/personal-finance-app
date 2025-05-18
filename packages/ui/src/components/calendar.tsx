import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { classNames as cn } from '#/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components: userComponents,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = {
    months: 'relative flex flex-col sm:flex-row gap-4',
    month: 'w-full',
    month_caption:
      'relative mx-10 mb-1 flex h-9 items-center justify-center z-20',
    caption_label: 'text-preset-3 text-grey-900',
    nav: 'absolute top-0 flex w-full justify-between z-10',
    button_previous: cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-grey-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      'hover:bg-beige-100 hover:text-grey-900',
      'size-9 text-grey-500 hover:text-grey-900 p-0',
    ),
    button_next: cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-grey-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      'hover:bg-beige-100 hover:text-grey-900',
      'size-9 text-grey-500 hover:text-grey-900 p-0',
    ),
    weekday: 'size-9 p-0 text-preset-4 text-grey-500',
    day_button:
      'relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-grey-900 group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow] group-[[data-selected]:not(.range-middle)]:duration-150 group-data-disabled:pointer-events-none focus-visible:z-10 hover:not-in-data-selected:bg-beige-100 group-data-selected:bg-green hover:not-in-data-selected:text-grey-900 group-data-selected:text-white group-data-disabled:text-grey-300 group-data-disabled:line-through group-data-outside:text-grey-300 group-data-selected:group-data-outside:text-white outline-none focus-visible:ring-grey-300/50 focus-visible:ring-[3px] group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-[.range-middle]:group-data-selected:bg-beige-100 group-[.range-middle]:group-data-selected:text-grey-900',
    day: 'group size-9 px-0 py-px text-preset-4',
    range_start: 'range-start',
    range_end: 'range-end',
    range_middle: 'range-middle',
    today:
      '*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-green [&[data-selected]:not(.range-middle)>*]:after:bg-white [&[data-disabled]>*]:after:bg-grey-300 *:after:transition-colors',
    outside:
      'text-grey-300 data-selected:bg-beige-100/50 data-selected:text-grey-300',
    hidden: 'invisible',
    week_number: 'size-9 p-0 text-preset-4 text-grey-500',
  };

  const mergedClassNames: typeof defaultClassNames = Object.keys(
    defaultClassNames,
  ).reduce(
    (acc, key) => ({
      ...acc,
      [key]: classNames?.[key as keyof typeof classNames]
        ? cn(
            defaultClassNames[key as keyof typeof defaultClassNames],
            classNames[key as keyof typeof classNames],
          )
        : defaultClassNames[key as keyof typeof defaultClassNames],
    }),
    {} as typeof defaultClassNames,
  );

  const defaultComponents = {
    Chevron: (props: {
      className?: string;
      size?: number;
      disabled?: boolean;
      orientation?: 'left' | 'right' | 'up' | 'down';
    }) => {
      if (props.orientation === 'left') {
        return <ChevronLeftIcon size={16} {...props} aria-hidden="true" />;
      }
      return <ChevronRightIcon size={16} {...props} aria-hidden="true" />;
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('w-fit', className)}
      classNames={mergedClassNames}
      components={mergedComponents}
      {...props}
    />
  );
}

export { Calendar };
