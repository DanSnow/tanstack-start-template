import type { AutoFormFieldProps } from '@autoform/react';
import type React from 'react';
import { Input } from '~/components/ui/input';

export const DateField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Input
      id={id}
      type="date"
      className={error ? 'border-destructive' : ''}
      {...props}
    />
  );
};
