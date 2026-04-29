'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (res?.error || !res?.ok) {
      setError('Invalid email or password.');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-8">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold tracking-wider">AUTODRIVA</div>
          <div className="text-sm text-white/50 mt-1">Admin Dashboard</div>
        </div>

        <div
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit();
            }}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb] mb-4"
            autoFocus
          />

          <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmit();
            }}
            className="w-full bg-black border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb] mb-4"
          />

          {error && (
            <div className="text-sm text-red-400 mb-3 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-semibold py-2 rounded-md transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}
