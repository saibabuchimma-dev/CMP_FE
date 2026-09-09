'use client';

import { Card as MantineCard, CardProps, CardSection } from '@mantine/core';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, hover, children, ...props }: CardProps & { hover?: boolean; children: ReactNode }) {
  return (
    <MantineCard
      className={cn(
        'border border-border shadow-card transition-all duration-200',
        hover && 'hover:shadow-card-hover hover:border-border-light',
        className
      )}
      radius="xl"
      shadow="sm"
      withBorder
      {...props}
    >
      {children}
    </MantineCard>
  );
}

export function CardHeader({ className, children, action, ...props }: CardSectionProps & { action?: ReactNode }) {
  return (
    <CardSection className={cn('flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between', className)} {...props}>
      <div>{children}</div>
      {action && <div className="self-start">{action}</div>}
    </CardSection>
  );
}

export function CardContent({ className, children, ...props }: CardSectionProps) {
  return <CardSection className={cn('pt-5', className)} {...props}>{children}</CardSection>;
}

export function CardFooter({ className, children, ...props }: CardSectionProps) {
  return <CardSection className={cn('flex items-center gap-3 border-t pt-4', className)} {...props}>{children}</CardSection>;
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}