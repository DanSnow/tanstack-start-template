import { fieldConfig, ZodProvider } from '@autoform/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { AutoForm } from '~/components/ui/autoform';
import { authClient } from '~/lib/auth-client'; //import the auth client

const formSchema = z.object({
  email: z.email().check(
    fieldConfig({
      inputProps: {
        type: 'email',
      },
    }),
  ),
  password: z
    .string()
    .min(8)
    .check(
      fieldConfig({
        inputProps: {
          type: 'password',
        },
      }),
    ),
});

const schema = new ZodProvider(formSchema);

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationKey: ['auth', 'signIn'],
    mutationFn: async ({ email, password }: z.infer<typeof formSchema>) => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });
  return (
    <div>
      <AutoForm
        schema={schema}
        withSubmit
        onSubmit={(values) => {
          mutate(values);
        }}
      />
    </div>
  );
}
