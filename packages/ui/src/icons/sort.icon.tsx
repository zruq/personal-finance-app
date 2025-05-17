import * as React from 'react';

const SortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
    <path d="M13 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM4.5 4.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 1 1 0-1Zm2.5 7H4.5a.5.5 0 0 1 0-1H7a.5.5 0 0 1 0 1Zm.5-3h-3a.5.5 0 1 1 0-1h3a.5.5 0 1 1 0 1Zm4.854 1.854-1.5 1.5a.503.503 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708l.646.647V7.5a.5.5 0 0 1 1 0v2.793l.646-.647a.5.5 0 0 1 .708.708Z" />
  </svg>
);
export default SortIcon;
