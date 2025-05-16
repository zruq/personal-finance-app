const integerFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value: number) {
  return Number.isInteger(value)
    ? integerFormatter.format(value)
    : decimalFormatter.format(value);
}

export const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};
