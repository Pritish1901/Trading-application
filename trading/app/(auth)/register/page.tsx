import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account - Crypto Trading',
  description: 'Create a new trading account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-neutral-400">Join the trading platform</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
