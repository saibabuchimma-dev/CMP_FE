'use client';

import { Modal as MantineModal, ModalProps } from '@mantine/core';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      radius="lg"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-body-md text-text-secondary">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </MantineModal>
  );
}

interface DrawerProps extends Omit<ModalProps, 'opened' | 'onClose' | 'centered'> {
  opened: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  title?: ReactNode;
  children: ReactNode;
}

export function Drawer({ opened, onClose, position = 'right', title, children, size = 'md', ...props }: DrawerProps) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      centered={false}
      radius="lg"
      size={size}
      styles={{
        overlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
        content: {
          maxHeight: '100vh',
          height: '100vh',
          borderRadius: position === 'right' ? '12px 0 0 12px' : '0 12px 12px 0',
        },
      }}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-heading-md font-heading font-semibold text-text">{title}</div>
          <button onClick={onClose} className="btn-ghost p-1.5" aria-label="Close">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto">{children}</div>
    </MantineModal>
  );
}