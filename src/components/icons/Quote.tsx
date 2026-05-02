export const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M17 5H3" />
    <path d="M21 12H8" />
    <path d="M21 19H8" />
    <path d="M3 12v7" />
  </svg>
);
