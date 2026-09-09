'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Group, Text, Button } from '@mantine/core';
import { cn } from '@/lib/utils';
import { LogOut, User, Bell, Palette, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      activeModule=""
    >
      <div className="animate-fade-in">
        <div className="mb-7 flex flex-col gap-4 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
              Settings
            </h1>
            <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6 max-w-3xl">
          <Card radius="xl" withBorder shadow="sm" className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-light text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Account
                </h3>
                <p className="mt-1 text-body-sm text-text-muted">
                  {user?.name} &middot; {user?.email} &middot; {user?.role}
                </p>
              </div>
            </div>
          </Card>

          <Card radius="xl" withBorder shadow="sm" className="p-6">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--color-text)' }}>Theme</p>
                  <p className="text-body-sm text-text-muted">Light, dark, or system preference</p>
                </div>
                <select className="input w-auto" defaultValue="system">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--color-text)' }}>Notifications</p>
                  <p className="text-body-sm text-text-muted">Email and in-app notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-checked:bg-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:border-transparent" />
                </label>
              </div>
            </div>
          </Card>

          <Card radius="xl" withBorder shadow="sm" className="p-6" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-danger)' }}>
                  Danger Zone
                </p>
                <p className="mt-1 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Once you sign out, you'll need to sign in again to access your projects.
                </p>
              </div>
              <Button variant="outline" color="red" onClick={handleLogout} leftSection={<LogOut className="h-4 w-4" />}>
                Sign out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}