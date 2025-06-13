import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { ZodProvider } from '@autoform/zod'
import { AutoForm, fieldConfig } from '~/components/ui/autoform'
import { authClient } from '~/lib/auth-client' //import the auth client

const formSchema = z.object({
  email: z
    .string()
    .email()
    .superRefine(
      fieldConfig({
        inputProps: {
          type: 'email',
        },
      }),
    ),
  password: z
    .string()
    .min(8)
    .superRefine(
      fieldConfig({
        inputProps: {
          type: 'password',
        },
      }),
    ),
  name: z.string(),
})

const schema = new ZodProvider(formSchema)

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: async ({ email, password, name }: z.infer<typeof formSchema>) => {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: '/',
      })
      if (error) {
        throw error
      }
      return data
    },
    onSuccess: () => {
      navigate({ to: '/' })
    },
  })
  return (
    <div>
      <AutoForm
        schema={schema}
        withSubmit
        onSubmit={(values) => {
          mutate(values)
        }}
      />
    </div>
  )
}
