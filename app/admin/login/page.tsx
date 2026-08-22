'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, AlertCircle, Clock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInactive = searchParams.get('reason') === 'inactive';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Record initial activity timestamp
        localStorage.setItem('stl_admin_last_activity', Date.now().toString());
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-neutral-border shadow-elevated space-y-6">
      <div className="text-center space-y-3">
        <Logo variant="dark" size="md" />
        <div className="pt-2">
          <h1 className="text-xl font-bold text-primary-navy">Admin Portal Login</h1>
          <p className="text-xs text-neutral-muted">Authorized administrators & management only</p>
        </div>
      </div>

      {isInactive && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>You were automatically signed out due to 20 minutes of inactivity.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input border border-neutral-border text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Mail className="w-4 h-4 text-neutral-muted absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-primary-navy uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input border border-neutral-border text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <Lock className="w-4 h-4 text-neutral-muted absolute left-3.5 top-3" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full justify-center font-bold"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-neutral-muted">Loading login portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
