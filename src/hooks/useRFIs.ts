import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfisService } from '@/services/api';
import type { RFI, RFIFilters, CreateRFIInput, UpdateRFIInput } from '@/types';

export const rfiKeys = {
  all: ['rfis'] as const,
  lists: (projectId: string) => [...rfiKeys.all, 'list', projectId] as const,
  list: (projectId: string, filters: RFIFilters) => [...rfiKeys.lists(projectId), filters] as const,
  details: (projectId: string) => [...rfiKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, id: string) => [...rfiKeys.details(projectId), id] as const,
};

export function useRFIs(projectId: string | null, filters?: RFIFilters) {
  return useQuery({
    queryKey: projectId ? rfiKeys.list(projectId, filters ?? {}) : ['rfis', 'empty'],
    queryFn: () => projectId ? rfisService.getRFIs(projectId, filters) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRFI(projectId: string | null, id: string | null) {
  return useQuery({
    queryKey: projectId && id ? rfiKeys.detail(projectId, id) : ['rfis', 'empty'],
    queryFn: () => projectId && id ? rfisService.getRFI(projectId, id) : null,
    enabled: !!projectId && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRFI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rfisService.createRFI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfiKeys.lists(variables.projectId) });
    },
  });
}

export function useUpdateRFI() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, id, data }: { projectId: string; id: string; data: UpdateRFIInput }) => 
      rfisService.updateRFI(projectId, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rfiKeys.lists(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: rfiKeys.detail(variables.projectId, variables.id) });
    },
  });
}