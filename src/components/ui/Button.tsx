'use client';

import { Button as MantineButton, ButtonProps } from '@mantine/core';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonPropsExtended extends ButtonProps {
  children: ReactNode;
}

export function Button({ className, variant = 'filled', color = 'primary', size = 'sm', radius = 'md', ...props }: ButtonPropsExtended) {
  return (
    <MantineButton
      className={cn(className)}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      {...props}
    />
  );
}

export function IconButton({ className, variant = 'subtle', color = 'primary', size = 'sm', radius = 'md', ...props }: ButtonPropsExtended) {
  return (
    <MantineButton
      className={cn(className)}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      {...props}
    />
  );
}