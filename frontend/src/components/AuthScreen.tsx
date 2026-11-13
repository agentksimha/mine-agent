import React, { useState } from 'react';
import { Loader2, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(current => current === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_42%)]" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111114]/95 p-7 sm:p-9 shadow-2xl">
        <div className="mb-8">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="font-headline text-3xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === 'login' ? 'Sign in to continue to MineRakshak.' : 'Your conversations and reports stay linked to your account.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Name</span>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-amber-500/50">
                <UserRound className="h-4 w-4 text-slate-500" />
                <input required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" autoComplete="name" />
              </div>
            </label>
          )}
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
            <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-amber-500/50">
              <Mail className="h-4 w-4 text-slate-500" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" autoComplete="email" />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</span>
            <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-amber-500/50">
              <LockKeyhole className="h-4 w-4 text-slate-500" />
              <input required type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            </div>
            {mode === 'register' && <span className="mt-2 block text-xs text-slate-600">Use at least 8 characters.</span>}
          </label>
          {mode === 'register' && (
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm password</span>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-amber-500/50">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <input required type="password" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-transparent px-3 py-3.5 text-sm outline-none" autoComplete="new-password" />
              </div>
            </label>
          )}

          {error && <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 font-semibold transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? 'New to MineRakshak?' : 'Already have an account?'}{' '}
          <button type="button" onClick={switchMode} className="font-semibold text-amber-400 hover:text-amber-300">
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
};
