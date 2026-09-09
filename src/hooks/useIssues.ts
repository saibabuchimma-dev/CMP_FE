import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesService } from '@/services/api';
import type { Issue, IssueFilters, CreateIssueInput, UpdateIssueInput } from '@/types';

export const issueKeys = {
  all: ['issues'] as const,
  lists: (projectId: string) => [...issueKeys.all, 'list', projectId] as const,
  list: (projectId: string, filters: IssueFilters) => [...issueKeys.lists(projectId), filters] as const,
  details: (projectId: string) => [...issueKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, id: string) => [...issueKeys.details(projectId), id] as const,
};

export function useIssues(projectId: string | null, filters?: IssueFilters) {
  return useQuery({
    queryKey: projectId ? issueKeys.list(projectId, filters ?? {}) : ['issues', 'empty'],
    queryFn: () => projectId ? issuesService.getIssues(projectId, filters) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useIssue(projectId: string | null, id: string | null) {
  return useQuery({
    queryKey: projectId && id ? issueKeys.detail(projectId, id) : ['issues', 'empty'],
    queryFn: () => projectId && id ? issuesService.getIssue(projectId, id) : null,
    enabled: !!projectId && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: issuesService.createIssue,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists(variables.projectId) });
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, id, data }: { projectId: string; id: string; data: UpdateIssueInput }) => 
      issuesService.updateIssue(projectId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(variables.projectId, variables.id) });
    },
  });
}