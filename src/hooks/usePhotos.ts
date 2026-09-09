import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photosService } from '@/services/api';
import type { Photo, CreatePhotoInput } from '@/types';

export const photoKeys = {
  all: ['photos'] as const,
  lists: (projectId: string) => [...photoKeys.all, 'list', projectId] as const,
  details: (projectId: string) => [...photoKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, id: string) => [...photoKeys.details(projectId), id] as const,
};

export function usePhotos(projectId: string | null) {
  return useQuery({
    queryKey: projectId ? photoKeys.lists(projectId) : ['photos', 'empty'],
    queryFn: () => projectId ? photosService.getPhotos(projectId) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePhoto(projectId: string | null, id: string | null) {
  return useQuery({
    queryKey: projectId && id ? photoKeys.detail(projectId, id) : ['photos', 'empty'],
    queryFn: () => projectId && id ? photosService.getPhoto(projectId, id) : null,
    enabled: !!projectId && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: photosService.createPhoto,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: photoKeys.lists(variables.projectId) });
    },
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file, metadata }: { projectId: string; file: File; metadata: Partial<CreatePhotoInput> }) =>
      photosService.uploadPhoto(projectId, file, metadata),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: photoKeys.lists(variables.projectId) });
    },
  });
}