import {
  Input,
  type InputProps,
} from '@personal-finance-app/ui/components/input';
import * as React from 'react';

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#252623"
      d="M15.457 8.678c-.022-.05-.551-1.224-1.728-2.401C12.16 4.709 10.18 3.88 8 3.88s-4.16.829-5.729 2.397C1.094 7.454.562 8.63.543 8.677a.5.5 0 0 0 0 .407c.022.05.551 1.223 1.728 2.4C3.84 13.05 5.82 13.88 8 13.88s4.16-.829 5.729-2.396c1.177-1.177 1.706-2.35 1.728-2.4a.5.5 0 0 0 0-.406ZM8 11.38a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
    />
  </svg>
);

const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      suffixNode={
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setShowPassword((v) => !v)}
        >
          <EyeIcon className="fill-grey-900 size-4" />
        </button>
      }
    />
  );
};

export { PasswordInput };
