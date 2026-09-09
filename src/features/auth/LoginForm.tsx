'use client';

import { useState, FormEvent } from 'react';
import { Button, PasswordInput, TextInput, Text } from '@mantine/core';
import { Wordmark } from '@/components/ui/Wordmark';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() && password) {
      onSubmit(email.trim(), password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
      <div>
        <label className="label" htmlFor="login-email">Work email</label>
        <TextInput
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="you@company.com"
          type="email"
          autoComplete="email"
          required
          size="md"
          radius="md"
          className="w-full login-input"
          classNames={{ input: 'w-full' }}
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="label mb-0" htmlFor="login-password">Password</label>
          <span className="text-[11px] font-medium text-text-muted">Secure access</span>
        </div>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          size="md"
          radius="md"
          className="w-full login-input"
          classNames={{ input: 'w-full', innerInput: 'w-full' }}
        />
      </div>
      {error && (
        <p role="alert" className="-mb-1 rounded-md border border-danger/20 bg-danger-bg px-3 py-2.5 text-xs leading-5 text-danger">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="mt-1 h-12 bg-primary font-medium tracking-[0.01em] transition-transform hover:bg-primary/90 hover:-translate-y-px"
        size="md"
        radius="md"
        loading={isLoading}
      >
        Sign in
      </Button>
      <Text size="xs" c="dimmed" className="text-center leading-5">
        Frontend demo workspace
      </Text>
    </form>
  );
}

interface LoginPageProps {
  onSubmit: (email: string, password: string) => void;
}

export function LoginPage({ onSubmit, isLoading, error }: LoginPageProps & { isLoading?: boolean; error?: string }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[radial-gradient(circle_at_top,#ffffff_0%,#f5f3ee_48%,#e9e5dc_100%)] px-5 py-10 sm:px-8">
      <div className="w-full md:w-1/2 md:min-w-[520px] md:max-w-[680px]">
        <div className="rounded-2xl border border-border bg-surface px-6 py-8 shadow-[0_20px_70px_rgba(31,58,78,0.10)] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="mb-10 flex items-center justify-between">
            <Wordmark size={18} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">Frontend demo</span>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Project workspace</p>
            <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl">
              Sign in to your projects
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-text-secondary">
              Access your drawings, decisions, daily logs, and project updates from one workspace.
            </p>
          </div>

          <LoginForm onSubmit={onSubmit} isLoading={isLoading} error={error} />

          <div className="mt-8 flex items-center justify-between border-t border-border-light pt-5 text-[11px] text-text-muted">
            <span>Build Better platform</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}