import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submittalsService } from '@/services/api';
import type { Submittal, SubmittalFilters, CreateSubmittalInput, UpdateSubmittalInput } from '@/types';

export const submittalKeys = {
  all: ['submittals'] as const,
  lists: (projectId: string) => [...submittalKeys.all, 'list', projectId] as const,
  list: (projectId: string, filters: SubmittalFilters) => [...submittalKeys.lists(projectId), filters] as const,
  details: (projectId: string) => [...submittalKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, id: string) => [...submittalKeys.details(projectId), id] as const,
};

export function useSubmittals(projectId: string | null, filters?: SubmittalFilters) {
  return useQuery({
    queryKey: projectId ? submittalKeys.list(projectId, filters ?? {}) : ['submittals', 'empty'],
    queryFn: () => projectId ? submittalsService.getSubmittals(projectId, filters) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSubmittal(projectId: string | null, id: string | null) {
  return useQuery({
    queryKey: projectId && id ? submittalKeys.detail(projectId, id) : ['submittals', 'empty'],
    queryFn: () => projectId && id ? submittalsService.getSubmittal(projectId, id) : null,
    enabled: !!projectId && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateSubmittal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submittalsService.createSubmittal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: submittalKeys.lists(variables.projectId) });
    },
  });
}

export function useUpdateSubmittal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, id, data }: { projectId: string; id: string; data: UpdateSubmittalInput }) => 
      submittalsService.updateSubmittal(projectId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: submittalKeys.lists(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: submittalKeys.detail(variables.projectId, variables.id) });
    },
  });
}