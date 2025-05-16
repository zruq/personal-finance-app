import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

type DialogProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
function Dialog({
  title,
  open,
  children,
  description,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black opacity-50" />
        <DialogPrimitive.Content className="fixed top-[50%] left-[50%] z-50 w-full max-w-[560px] translate-x-[-50%] translate-y-[-50%] p-5">
          <div className="rounded-xl w-full bg-white px-5 py-6">
            <div className="flex items-center justify-between pb-5">
              <DialogPrimitive.Title className="text-preset-2 text-grey-900">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="group cursor-pointer">
                <CloseIcon className="fill-grey-500 group-hover:fill-grey-900 size-8 transition-colors duration-300" />
              </DialogPrimitive.Close>
            </div>

            <DialogPrimitive.Description className="text-preset-4 text-grey-500 pb-5">
              {description}
            </DialogPrimitive.Description>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M20.53 12.53 17.06 16l3.47 3.47a.75.75 0 1 1-1.06 1.06L16 17.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L14.94 16l-3.47-3.47a.75.75 0 0 1 1.06-1.06L16 14.94l3.47-3.47a.75.75 0 0 1 1.06 1.06ZM28.75 16A12.75 12.75 0 1 1 16 3.25 12.765 12.765 0 0 1 28.75 16Zm-1.5 0A11.25 11.25 0 1 0 16 27.25 11.262 11.262 0 0 0 27.25 16Z" />
  </svg>
);

export { Dialog };
