'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';
import '@mantine/notifications/styles.css';

const theme = createTheme({
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontFamilyMonospace: "'IBM Plex Mono', monospace",
  headings: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: '600',
  },
  primaryColor: 'primary',
  colors: {
    primary: [
      '#E8F0F4',
      '#D1E1EB',
      '#A3C3D7',
      '#75A5C3',
      '#4787AF',
      '#1F3A4E',
      '#183042',
      '#112636',
      '#0A1C2A',
      '#03121E',
    ],
    success: [
      '#E8F0E8',
      '#D1E1D1',
      '#A3C3A3',
      '#75A575',
      '#478747',
      '#3F7352',
      '#335F43',
      '#264B34',
      '#1A3726',
      '#0D2317',
    ],
    warning: [
      '#F5EEDC',
      '#EBDDB9',
      '#D7BB93',
      '#C3996D',
      '#AF7747',
      '#A57920',
      '#84611A',
      '#634914',
      '#42310E',
      '#211807',
    ],
    danger: [
      '#F6E8E3',
      '#ECD1C7',
      '#D9A3A9',
      '#C6757B',
      '#B3474D',
      '#A74732',
      '#863928',
      '#652B1E',
      '#441D14',
      '#220E0A',
    ],
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    lg: '0 10px 40px -10px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
      styles: {
        root: {
          fontWeight: 500,
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
      styles: {
        input: {
          fontFamily: "'IBM Plex Sans', sans-serif",
        },
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
      },
      styles: {
        content: {
          padding: '1.5rem',
        },
      },
    },
    Drawer: {
      defaultProps: {
        position: 'right',
      },
      styles: {
        content: {
          padding: '1.5rem',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'xl',
        shadow: 'sm',
      },
      styles: {
        root: {
          border: '1px solid var(--mantine-color-border)',
          transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xs',
        size: 'xs',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        striped: false,
      },
      styles: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
        th: {
          fontWeight: 500,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--mantine-color-text-muted)',
          backgroundColor: 'var(--mantine-color-background)',
          borderBottom: '1px solid var(--mantine-color-border)',
          padding: '0.75rem 1.25rem',
        },
        td: {
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--mantine-color-border-light)',
          fontSize: '0.875rem',
        },
        tr: {
          transition: 'background-color 150ms ease',
        },
      },
    },
    Notification: {
      styles: {
        root: {
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)',
        },
        title: {
          fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif",
        },
      },
    },
    Tooltip: {
      defaultProps: {
        radius: 'sm',
        withArrow: true,
      },
      styles: {
        tooltip: {
          backgroundColor: 'var(--mantine-color-text)',
          color: 'var(--mantine-color-surface)',
          fontSize: '0.75rem',
          padding: '0.5rem 0.75rem',
        },
      },
    },
  },
});

export function MantineThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" autoClose={4000} limit={3} />
      {children}
    </MantineProvider>
  );
}