import type { ArrayElementWrapperProps } from '@autoform/react';
import { TrashIcon } from 'lucide-react';
import type React from 'react';
import { Button } from '~/components/ui/button';

export const ArrayElementWrapper: React.FC<ArrayElementWrapperProps> = ({
  children,
  onRemove,
}) => {
  return (
    <div className="relative border p-4 rounded-md mt-2">
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        type="button"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      {children}
    </div>
  );
};
