import { Button } from '@personal-finance-app/ui/components/button';

type PageHeaderProps = {
  title: string;
  action?: {
    text: string;
    onClick: () => void;
  };
};

const PageHeader = ({ title, action }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-preset-1">{title}</h1>
      {action && <Button onClick={action.onClick}>{action.text}</Button>}
    </div>
  );
};

export { PageHeader };
