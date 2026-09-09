'use client';

import { TextInput, TextInputProps } from '@mantine/core';
import { type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {}

export const Input = Object.assign(
  ((props: InputProps, ref) => (
    <TextInput
      ref={ref}
      className={cn(props.className)}
      size="sm"
      radius="md"
      {...props}
    />
  )) as ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>,
  {
    displayName: 'Input',
  }
);

export const SearchInput = Object.assign(
  ((props: InputProps, ref) => (
    <TextInput
      ref={ref}
      className={cn('pl-9', props.className)}
      size="sm"
      radius="md"
      leftSection={<span className="text-text-muted">🔍</span>}
      {...props}
    />
  )) as ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>>,
  {
    displayName: 'SearchInput',
  }
);