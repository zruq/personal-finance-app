import { useId, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '#/components/popover';
import { Button } from './button';
import { classNames } from '#/lib/utils';
import { Calendar } from './calendar';
import * as LabelPrimitive from '@radix-ui/react-label';

type DatePickerProps = {
  label: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  helperText?: string;
  className?: string;
  hideLabel?: boolean;
  id?: string;
  disabled?: boolean;
};

function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Pick a date',
  helperText,
  className,
  hideLabel = false,
  id,
  disabled = false,
}: DatePickerProps) {
  const genId = useId();
  const finalId = id ?? genId;
  const [date, setDate] = useState<Date | undefined>(value);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  return (
    <div className={className}>
      <LabelPrimitive.Root
        htmlFor={finalId}
        className={classNames(
          'text-preset-5 text-grey-500 block pb-1 font-bold',
          { 'sr-only': hideLabel },
        )}
      >
        {label}
      </LabelPrimitive.Root>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={finalId}
            variant="secondary"
            disabled={disabled}
            className={classNames(
              'flex items-center border-beige-500 hover:border-grey-500 focus:border-grey-900 bg-white text-preset-4 w-full justify-between px-5 py-3 font-normal outline-none',
              !date && 'text-beige-500',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <span className={classNames('truncate', !date && 'text-beige-500')}>
              {date ? format(date, 'PPP') : placeholder}
            </span>
            <CalendarIcon
              size={16}
              className={classNames(
                'shrink-0 transition-colors',
                date ? 'text-grey-500' : 'text-beige-500',
                disabled ? 'text-grey-300' : 'group-hover:text-grey-900',
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>

      {helperText && (
        <p className="text-preset-5 text-grey-500 flex justify-end pt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

export { DatePicker, type DatePickerProps };
