import { cn } from '@/libs/utils';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  label: string;
  required?: boolean;
  asLegend?: boolean;
};

export const Label: React.FC<LabelProps> = ({ label, className, required, asLegend, ...props }) => {
  const baseClass = 'block text-sm font-semibold';
  const content = (
    <>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </>
  );

  if (asLegend) {
    return <legend className={cn(baseClass, 'mb-1.5', className)}>{content}</legend>;
  }

  return (
    <label className={cn(baseClass, className)} {...props}>
      {content}
    </label>
  );
};
