import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@personal-finance-app/ui/components/button';
import { Input } from '@personal-finance-app/ui/components/input';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from './-components/password-input';
import { authClient, getFriendlyAuthErrorMessage } from '@/clients/authClient';

export const Route = createLazyFileRoute('/_unauthenticated/login')({
  component: RouteComponent,
});

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().nonempty('Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const { handleSubmit, register, formState, setError } =
    useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await authClient.signIn.email(data, {
      onSuccess: () => {
        navigate({ to: '/' });
      },
      onError: (context) => {
        setError('root', {
          message: getFriendlyAuthErrorMessage(context.error.code),
        });
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="pb-8 space-y-2">
        <h1 className="text-preset-1 text-grey-900">Login</h1>
        {formState.errors.root?.message && (
          <p className="text-preset-5 text-red">
            {formState.errors.root.message}
          </p>
        )}
      </div>
      <div className="space-y-4 pb-8">
        <Input
          {...register('email')}
          type="email"
          label="Email"
          error={formState.errors.email?.message}
        />
        <PasswordInput
          {...register('password')}
          label="Password"
          error={formState.errors.password?.message}
        />
      </div>
      <Button className="w-full">Login</Button>
      <p className="text-preset-4 text-grey-500 pt-8 text-center">
        Need to create an account?{' '}
        <Link to={'/signup'} className="text-grey-900 font-bold underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
