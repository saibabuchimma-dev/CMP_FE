'use client';

import { useState, FormEvent } from 'react';
import { Button, PasswordInput, TextInput, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  HardHat,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Wordmark } from '@/components/ui/Wordmark';

const DEMO_EMAIL = 'admin@buildbetter.com';
const DEMO_PASSWORD = 'BuildBetter123';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() && password) {
      onSubmit(email.trim(), password);
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    notifications.show({
      title: 'Demo Credentials Loaded',
      message: 'Email & Password auto-populated for admin access.',
      color: 'blue',
    });
  };

  const handleForgotPassword = () => {
    notifications.show({
      title: 'Password Reset',
      message: 'A password reset token has been dispatched to your system administrator.',
      color: 'teal',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3 text-[12px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <div className="truncate">
            <span className="font-semibold text-text">Demo Access: </span>
            <span className="font-mono text-text-muted">{DEMO_EMAIL}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="shadow-2xs shrink-0 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-surface transition-all hover:bg-primary/90"
        >
          Auto-fill
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-body-xs font-semibold text-text" htmlFor="login-email">
          Corporate Email
        </label>
        <TextInput
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="e.g. admin@buildbetter.com"
          type="email"
          autoComplete="email"
          required
          leftSection={<Mail className="h-4 w-4 text-text-muted" />}
          size="md"
          radius="md"
          classNames={{
            input:
              'w-[280px] max-w-full text-body-sm bg-surface border-border focus:border-primary',
          }}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-body-xs font-semibold text-text" htmlFor="login-password">
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[12px] font-medium text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Enter your security credentials"
          autoComplete="current-password"
          required
          leftSection={<Lock className="h-4 w-4 text-text-muted" />}
          size="md"
          radius="md"
          classNames={{
            input: 'w-full text-body-sm bg-surface border-border focus:border-primary',
          }}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-body-xs text-text-secondary">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-0"
          />
          <span>Remember this device for 30 days</span>
        </label>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-bg p-3 text-body-xs text-danger"
        >
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="shadow-xs mx-auto mb-2 mt-2 flex h-11 w-[240px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-surface transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-transparent" />
            <span>Authenticating...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>Sign In to Platform</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </button>
    </form>
  );
}

interface LoginPageProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function LoginPage({ onSubmit, isLoading, error }: LoginPageProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F5F3EE] px-4 py-12 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(#1F3A4E 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="pointer-events-none absolute left-6 top-6 hidden select-none font-mono text-[11px] text-primary/20 sm:block">
        GRID-REF: 12-B / CMP-PORTAL
      </div>
      <div className="pointer-events-none absolute right-6 top-6 hidden select-none font-mono text-[11px] text-primary/20 sm:block">
        ENV: PROD-NORTH-ASIAN-1
      </div>

      <div className="relative z-10 mx-auto w-[340px] max-w-full">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="shadow-2xs mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text">
              Enterprise Field Portal
            </span>
          </div>
          <Wordmark size={22} />
        </div>

        <div className="w-full rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_50px_rgba(31,58,78,0.08)] transition-all">
          <div className="mb-6">
            <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
              Sign In to Your Projects
            </h1>
            <p className="mt-1 text-body-xs text-text-secondary">
              Access engineering drawings, punch lists, daily journals, and stage controls.
            </p>
          </div>

          <LoginForm onSubmit={onSubmit} isLoading={isLoading} error={error} />

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5 font-medium text-text-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              <span>SOC2 Type II & SSL</span>
            </div>
            <span className="font-mono text-text-muted">v2.4.0</span>
          </div>
        </div>

        <div className="mt-6 text-center text-[12px] text-text-muted">
          <span>Build Better Construction Management Platform</span>
        </div>
      </div>
    </div>
  );
}
