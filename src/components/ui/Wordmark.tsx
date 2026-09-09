'use client';

import { HardHat } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WordmarkProps {
  size?: number;
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Wordmark({ size = 15, dark = false, className, children }: WordmarkProps) {
  const iconSize = size - 1;
  const containerSize = size + 12;

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          width: containerSize,
          height: containerSize,
          background: dark ? 'var(--color-background)' : 'var(--color-primary)',
        }}
      >
        <HardHat
          size={iconSize}
          color={dark ? 'var(--color-primary)' : 'var(--color-background)'}
          strokeWidth={2}
        />
      </div>
      <span
        style={{
          color: dark ? 'var(--color-background)' : 'var(--color-text)',
          fontFamily: 'var(--font-heading)',
          fontSize: size,
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        Build Better
      </span>
      {children}
    </div>
  );
}

export function BrandMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center rounded-lg', className)} style={{ width: size, height: size }}>
      <HardHat size={size * 0.6} color="var(--color-background)" strokeWidth={2} />
    </div>
  );
}

export function Logo({ size = 15, dark = false, className }: { size?: number; dark?: boolean; className?: string }) {
  return <Wordmark size={size} dark={dark} className={className} />;
}