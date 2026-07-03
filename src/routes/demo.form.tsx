import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute('/demo/form')({
  component: FormDemo,
});

function FormDemo() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const form = useForm({
    defaultValues: { name: '', email: '' },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => setSubmitted(value),
  });

  return (
    <div className="max-w-sm mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Manual Form (TanStack Form)</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={field.state.meta.errors.length ? 'border-destructive' : ''}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {typeof err === 'string' ? err : err?.message}
                  </p>
                ))}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={field.state.meta.errors.length ? 'border-destructive' : ''}
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {typeof err === 'string' ? err : err?.message}
                  </p>
                ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          )}
        </form.Subscribe>
      </form>

      {submitted && <pre className="p-4 bg-muted rounded-md text-sm">{JSON.stringify(submitted, null, 2)}</pre>}
    </div>
  );
}
