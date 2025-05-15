import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { authClient } from '@/clients/authClient';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@personal-finance-app/ui/components/input';
import { Button } from '@personal-finance-app/ui/components/button';
import { PasswordInput } from './-components/password-input';

export const Route = createLazyFileRoute('/_unauthenticated/login')({
  component: RouteComponent,
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function RouteComponent() {
  const { handleSubmit, register } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await authClient.signIn.email(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h1 className="text-preset-1 text-grey-900 pb-8">Login</h1>
      <div className="space-y-4 pb-8">
        <Input {...register('email')} type="email" label="Email" />
        <PasswordInput {...register('password')} label="Password" />
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
