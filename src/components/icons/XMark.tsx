export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
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
    <path d="M6 18 18 6M6 6l12 12" />
  </svg>
);
