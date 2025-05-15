import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { classNames } from '#lib/utils.js';

const buttonVariants = cva(
  'text-preset-4-bold rounded-lg cursor-pointer p-4 font-bold transition duration-300',
  {
    variants: {
      variant: {
        primary: 'bg-grey-900 hover:bg-grey-500 text-white',
        secondary:
          'bg-beige-100 hover:border-beige-500 border-beige-100 border hover:bg-white',
        tertiary: 'text-grey-500 hover:text-grey-900 font-normal',
        destroy: 'bg-red text-white hover:opacity-80',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

function Button({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={classNames(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
