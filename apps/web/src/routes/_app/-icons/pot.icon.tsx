import * as React from 'react';

const PotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path d="M11.5 3.05V2a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1v1.05a2.503 2.503 0 0 0-2 2.45v7A2.5 2.5 0 0 0 5 15h6a2.5 2.5 0 0 0 2.5-2.5v-7a2.503 2.503 0 0 0-2-2.45ZM7.5 2h1v1h-1V2Zm-2 0h1v1h-1V2Zm3 9.5v.5a.5.5 0 0 1-1 0v-.5H7a.5.5 0 0 1 0-1h1.5a.5.5 0 0 0 0-1h-1a1.5 1.5 0 0 1 0-3V6a.5.5 0 1 1 1 0v.5H9a.5.5 0 1 1 0 1H7.5a.5.5 0 1 0 0 1h1a1.5 1.5 0 0 1 0 3Zm2-8.5h-1V2h1v1Z" />
  </svg>
);
export default PotIcon;
