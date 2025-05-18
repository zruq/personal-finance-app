import { formatCurrency } from '@personal-finance-app/ui/lib/formatters';
import { classNames } from '@personal-finance-app/ui/lib/utils';
import type { RouterOutputs } from '@personal-finance-app/api/server';

type ProgressProps = {
  totalValue: number;
  currentValue: number;
  addedValue?: number;
  removedValue?: number;
  theme: RouterOutputs['pots']['all'][number]['theme'];
  label: string;
};
export default function Progress({
  theme,
  totalValue,
  addedValue,
  currentValue,
  removedValue,
  label,
}: ProgressProps) {
  const filledPercentage = (currentValue / totalValue) * 100;

  const removedPercentage = removedValue
    ? Math.min((removedValue / currentValue) * 100, 100)
    : null;
  const addedPercentage = addedValue
    ? Math.min(((addedValue + currentValue) / totalValue) * 100, 100)
    : null;

  const newValue = Math.max(
    Math.min(
      currentValue + (addedValue || 0) - (removedValue || 0),
      totalValue,
    ),
    0,
  );
  const newTotalPercentage = (newValue / totalValue) * 100;

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <p className="text-grey-500 text-preset-4">{label}</p>
        <p className="text-preset-1">{formatCurrency(newValue)}</p>
      </div>
      <div className="relative pb-3">
        {addedPercentage && (
          <div
            className={`bg-green absolute top-0 left-0 h-2 rounded-full`}
            style={{
              width: `${addedPercentage}%`,
            }}
          ></div>
        )}
        <div
          className={classNames('absolute top-0 left-0 h-2 rounded-full', {
            'rounded-r-none border-r-2 border-white':
              addedPercentage && filledPercentage > 0,
          })}
          style={{
            width: `${filledPercentage}%`,
            backgroundColor: theme.color,
          }}
        >
          {removedPercentage && (
            <div
              className={classNames(
                `bg-red absolute top-0 right-0 h-2 rounded-r-full border-l-2 border-white`,
                { 'rounded-l-full border-0': removedPercentage === 100 },
              )}
              style={{
                width: `${removedPercentage}%`,
              }}
            ></div>
          )}
        </div>

        <div className="bg-beige-100 overflow-hidden h-2 rounded-full"></div>
      </div>
      <div className="flex items-center justify-between pb-8">
        <span
          className={classNames('text-preset-5 text-grey-500 font-bold', {
            'text-red': removedPercentage,
            'text-green': addedPercentage,
          })}
        >
          {newTotalPercentage.toFixed(2)}%
        </span>
        <span className="text-preset-5 text-grey-500">
          Target of {formatCurrency(totalValue)}
        </span>
      </div>
    </>
  );
}
