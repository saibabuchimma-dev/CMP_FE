import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '@/services/api';
import type { Document, DocumentFilters, CreateDocumentInput } from '@/types';

export const documentKeys = {
  all: ['documents'] as const,
  lists: (projectId: string) => [...documentKeys.all, 'list', projectId] as const,
  list: (projectId: string, filters: DocumentFilters) => [...documentKeys.lists(projectId), filters] as const,
  details: (projectId: string) => [...documentKeys.all, 'detail', projectId] as const,
  detail: (projectId: string, docNo: string) => [...documentKeys.details(projectId), docNo] as const,
};

export function useDocuments(projectId: string | null, filters?: DocumentFilters) {
  return useQuery({
    queryKey: projectId ? documentKeys.list(projectId, filters ?? {}) : ['documents', 'empty'],
    queryFn: () => projectId ? documentsService.getDocuments(projectId, filters) : [],
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDocument(projectId: string | null, docNo: string | null) {
  return useQuery({
    queryKey: projectId && docNo ? documentKeys.detail(projectId, docNo) : ['documents', 'empty'],
    queryFn: () => projectId && docNo ? documentsService.getDocument(projectId, docNo) : null,
    enabled: !!projectId && !!docNo,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: documentsService.createDocument,
    onSuccess: (newDoc, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists(variables.projectId) });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, docNo, data }: { projectId: string; docNo: string; data: Partial<Document> }) => 
      documentsService.updateDocument(projectId, docNo, data),
    onSuccess: (updatedDoc, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists(variables.projectId) });
      queryClient.setQueryData(documentKeys.detail(variables.projectId, variables.docNo), updatedDoc);
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, file, metadata }: { projectId: string; file: File; metadata: Partial<CreateDocumentInput> }) =>
      documentsService.uploadDocument(projectId, file, metadata),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists(variables.projectId) });
    },
  });
}