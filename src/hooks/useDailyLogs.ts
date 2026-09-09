import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyLogsService } from '@/services/api';
import type { DailyLog, CreateDailyLogInput } from '@/types';

export const dailyLogKeys = {
  all: ['dailyLogs'] as const,
  lists: (projectId: string) => [...dailyLogKeys.all, 'list', projectId] as const,
  details: (projectId: string) => [...dailyLogKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, date: string) => [...dailyLogKeys.details(projectId), date] as const,
};

export function useDailyLogs(projectId: string | null) {
  return useQuery({
    queryKey: projectId ? dailyLogKeys.lists(projectId) : ['dailyLogs', 'empty'],
    queryFn: () => projectId ? dailyLogsService.getDailyLogs(projectId) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDailyLog(projectId: string | null, date: string | null) {
  return useQuery({
    queryKey: projectId && date ? dailyLogKeys.detail(projectId, date) : ['dailyLogs', 'empty'],
    queryFn: () => projectId && date ? dailyLogsService.getDailyLog(projectId, date) : null,
    enabled: !!projectId && !!date,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateDailyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dailyLogsService.createDailyLog,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists(variables.projectId) });
    },
  });
}

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, date, data }: { projectId: string; date: string; data: Partial<DailyLog> }) => 
      dailyLogsService.updateDailyLog(projectId, date, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.lists(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.detail(variables.projectId, variables.date) });
    },
  });
}