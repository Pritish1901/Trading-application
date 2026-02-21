'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store token in localStorage
      localStorage.setItem('auth_token', data.data.token);

      // Redirect to dashboard
      router.push('/trading');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:outline-none transition"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 focus:border-indigo-500 focus:outline-none transition"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center text-sm">
        <span className="text-neutral-400">Don&apos;t have an account? </span>
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
          Create one
        </Link>
      </div>
    </form>
  );
}
