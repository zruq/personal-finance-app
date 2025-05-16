import { cx } from 'class-variance-authority';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      'font-size': [
        'text-preset-1',
        'text-preset-2',
        'text-preset-3',
        'text-preset-4',
        'text-preset-5',
      ],
    },
  },
});
const classNames = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { classNames };
