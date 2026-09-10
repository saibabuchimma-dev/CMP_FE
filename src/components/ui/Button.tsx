'use client';

import { Button as MantineButton, type ButtonProps } from '@mantine/core';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonPropsExtended
  extends ButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps> {
  children?: ReactNode;
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