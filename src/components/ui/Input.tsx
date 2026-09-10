'use client';

import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <TextInput
    ref={ref}
    size="sm"
    radius="md"
    {...props}
    className={cn(props.className)}
  />
));

Input.displayName = 'Input';

export const SearchInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <TextInput
    ref={ref}
    size="sm"
    radius="md"
    leftSection={<Search className="h-4 w-4 text-text-muted" />}
    {...props}
    className={cn(props.className)}
  />
));

SearchInput.displayName = 'SearchInput';