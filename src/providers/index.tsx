'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { MantineThemeProvider } from './mantine-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <MantineThemeProvider>
          {children}
        </MantineThemeProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}