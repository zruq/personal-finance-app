import * as React from 'react';

const EllipsisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path d="M9.75 8a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0ZM3 6.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm10 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z" />
  </svg>
);
export default EllipsisIcon;
