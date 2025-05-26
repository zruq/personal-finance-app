import * as React from 'react';
import { classNames } from '#lib/utils.js';

type InputProps = React.ComponentProps<'input'> & {
  label: string;
  helperText?: string;
  suffixNode?: React.ReactNode;
  prefixNode?: React.ReactNode;
  hideLabel?: boolean;
  error?: string;
};

function Input({
  className,
  type,
  label,
  helperText,
  suffixNode,
  prefixNode,
  id,
  hideLabel,
  error,
  ...props
}: InputProps) {
  const genId = React.useId();
  const finalId = id ?? genId;
  return (
    <div>
      <label
        htmlFor={finalId}
        className={classNames(
          'text-preset-5 text-grey-500 block pb-1 font-bold',
          { 'sr-only': hideLabel },
          { 'text-red': error },
        )}
      >
        {label}
      </label>
      <div className="relative">
        {prefixNode && (
          <div className="absolute top-[50%] left-5 -translate-y-[50%]">
            {prefixNode}
          </div>
        )}
        <input
          id={finalId}
          type={type}
          className={classNames(
            'border-beige-500 hover:border-grey-500 focus:border-grey-900 text-preset-4 placeholder:text-beige-500 rounded-lg text-grey-900 w-full border px-5 py-3 outline-none',
            { 'pl-10': prefixNode },
            { 'pr-10': suffixNode },
            { 'border-red focus:border-red hover:border-red': error },
            className,
          )}
          {...props}
        />
        {error && (
          <p
            className={classNames(
              'absolute top-[50%] right-5 text-red-500 text-preset-5 -translate-y-[45%]',
              { 'right-10 -translate-y-2.5': suffixNode },
            )}
          >
            {error}
          </p>
        )}

        {suffixNode && (
          <div className="absolute top-[50%] right-5 -translate-y-[45%]">
            {suffixNode}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-preset-5 text-grey-500 flex justify-end pt-5">
          {helperText}
        </p>
      )}
    </div>
  );
}

export { Input, type InputProps };
