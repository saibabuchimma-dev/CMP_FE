'use client';

import { CalendarDays, CloudSun, CloudRain, Users, Clock, AlertTriangle } from 'lucide-react';
import { Card, Group, Text, Badge } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import type { DailyLog } from '@/types';

interface DailyLogTimelineProps {
  logs: DailyLog[];
  onCreate?: () => void;
}

export function DailyLogTimeline({ logs, onCreate }: DailyLogTimelineProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Daily log
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Weather, manpower and work summary reported from site
          </p>
        </div>
        {onCreate && (
          <button onClick={onCreate} className="btn-primary self-start">
            <Plus className="h-4 w-4" />
            Add entry
          </button>
        )}
      </div>

      <div className="space-y-2" style={{ background: 'var(--color-border)' }}>
        {logs.map((log) => (
          <Card key={log.date} radius="xl" withBorder shadow="sm" className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  {formatDate(log.date, 'long')}
                </span>
                <Badge variant="light" size="sm" color="gray">
                  {log.weather}
                </Badge>
                <Badge variant="light" size="sm" color="gray">
                  {log.manpower} on site
                </Badge>
              </div>
              {log.delays !== 'None' && (
                <Badge variant="light" size="sm" color="red">
                  <Clock className="h-3 w-3 mr-1" />
                  Delay: {log.delays}
                </Badge>
              )}
            </div>
            <p className="mt-3 leading-relaxed" style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
              {log.summary}
            </p>
            {log.delays !== 'None' && (
              <p className="mt-2 flex items-center gap-1.5 text-body-sm" style={{ color: 'var(--color-warning)' }}>
                <AlertTriangle className="h-4 w-4" />
                Delays: {log.delays}
              </p>
            )}
          </Card>
        ))}
        
        {logs.length === 0 && (
          <Card radius="xl" withBorder shadow="sm" className="p-12 text-center">
            <div className="empty-state-icon text-5xl mb-3" style={{ color: 'var(--color-border)' }}>
              <CalendarDays className="h-10 w-10 mx-auto" />
            </div>
            <div className="empty-state-title text-heading-sm font-heading font-medium text-text">
              No daily logs yet
            </div>
            <div className="empty-state-description text-body-sm text-text-muted mt-1">
              Start tracking daily site activity
            </div>
            {onCreate && (
              <button onClick={onCreate} className="btn-primary mt-4" size="sm">
                <Plus className="h-4 w-4" />
                Add entry
              </button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}