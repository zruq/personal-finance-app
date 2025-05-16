import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import React from 'react';
import { classNames } from '#/lib/utils';

type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: Array<{
    id: string;
    label: string;
    onClick: () => void;
    className?: string;
  }>;
};

const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          className="rounded-lg bg-white px-5 py-3 drop-shadow will-change-[opacity,transform]"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <DropdownMenuPrimitive.Item asChild>
                <button
                  onClick={item.onClick}
                  className={classNames(
                    'text-preset-4 cursor-pointer py-3 hover:outline-0',
                    {
                      'pt-0': index === 0,
                      'pb-0': index === items.length - 1,
                    },
                    item.className,
                  )}
                  type="button"
                >
                  {item.label}
                </button>
              </DropdownMenuPrimitive.Item>
              <DropdownMenuPrimitive.Separator className="bg-grey-100 h-px last:hidden" />
            </React.Fragment>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};

export { DropdownMenu };
