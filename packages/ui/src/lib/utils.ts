import { cx } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const classNames = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { classNames };
