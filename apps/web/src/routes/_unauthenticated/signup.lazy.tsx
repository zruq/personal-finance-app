import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@personal-finance-app/ui/components/button';
import { Input } from '@personal-finance-app/ui/components/input';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from './-components/password-input';
import { authClient, getFriendlyAuthErrorMessage } from '@/clients/authClient';

export const Route = createLazyFileRoute('/_unauthenticated/signup')({
  component: RouteComponent,
});

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type SignupFormData = z.infer<typeof signupSchema>;

function RouteComponent() {
  const { handleSubmit, register, formState, setError } =
    useForm<SignupFormData>({
      resolver: zodResolver(signupSchema),
    });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    await authClient.signUp.email(data, {
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
        <h1 className="text-preset-1 text-grey-900">Sign up</h1>
        {formState.errors.root?.message && (
          <p className="text-preset-5 text-red">
            {formState.errors.root.message}
          </p>
        )}
      </div>
      <div className="space-y-4 pb-8">
        <Input
          {...register('name')}
          type="name"
          label="Name"
          error={formState.errors.name?.message}
        />
        <Input
          {...register('email')}
          type="email"
          label="Email"
          error={formState.errors.email?.message}
        />
        <PasswordInput
          {...register('password')}
          label="Create Password"
          helperText="Passwords must be at least 8 characters"
          error={formState.errors.password?.message}
        />
      </div>
      <Button className="w-full">Create Account</Button>
      <p className="text-preset-4 text-grey-500 pt-8 text-center">
        Already have an account?{' '}
        <Link to={'/login'} className="text-grey-900 font-bold underline">
          Login
        </Link>
      </p>
    </form>
  );
}
