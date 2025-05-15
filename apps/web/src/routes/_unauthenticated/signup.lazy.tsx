import { authClient } from '@/clients/authClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@personal-finance-app/ui/components/input';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { PasswordInput } from './-components/password-input';
import { Button } from '@personal-finance-app/ui/components/button';

export const Route = createLazyFileRoute('/_unauthenticated/signup')({
  component: RouteComponent,
});

const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

type SignupFormData = z.infer<typeof signupSchema>;

function RouteComponent() {
  const { handleSubmit, register } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    await authClient.signUp.email(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="text-preset-1 text-grey-900 pb-8">Sign up</h1>
      <div className="space-y-4 pb-8">
        <Input {...register('name')} type="name" label="Name" />
        <Input {...register('email')} type="email" label="Email" />
        <PasswordInput
          {...register('password')}
          label="Create Password"
          helperText="Passwords must be at least 8 characters"
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
