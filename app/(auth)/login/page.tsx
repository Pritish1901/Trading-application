import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In - Crypto Trading',
  description: 'Sign in to your trading account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Trading</h1>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
