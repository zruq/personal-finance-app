import * as React from 'react';
import { classNames } from '#lib/utils.js';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={classNames(
        'rounded-xl w-full bg-white px-5 py-6 md:p-8',
        className,
      )}
      {...props}
    />
  );
}

export { Card };
