type FormColProps = {
  visible?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const FormCol: React.FC<FormColProps> = ({
  visible = true,
  className = 'col-span-12 sm:col-span-6',
  children,
}) => {
  if (!visible) return null;
  return <div className={className}>{children}</div>;
};
