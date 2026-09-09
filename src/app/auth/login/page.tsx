'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { LoginPage as LoginForm } from '@/features/auth/LoginForm';

const DEMO_EMAIL = 'admin@buildbetter.com';
const DEMO_PASSWORD = 'BuildBetter123!';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      setLoading(false);
      return;
    }
    
    login({
      id: 'user-1',
      email,
      name: email.split('@')[0],
      role: 'engineer',
    });
    
    setIsLoading(false);
    setLoading(false);
    router.push('/projects');
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />;
}