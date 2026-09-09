import type { Document, CreateDocumentInput, DocumentFilters, PaginatedResponse } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

function filterDocuments(docs: Document[], filters: DocumentFilters): Document[] {
  return docs.filter(doc => {
    if (filters.category && filters.category !== 'All' && doc.cat !== filters.category) return false;
    if (filters.status && doc.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!doc.no.toLowerCase().includes(search) && !doc.title.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}

export const documentsService = {
  async getDocuments(projectId: string, filters?: DocumentFilters): Promise<Document[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return [];
      return filters ? filterDocuments(project.docs, filters) : project.docs;
    }
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    return apiClient.get<Document[]>(`/projects/${projectId}/documents`, { params });
  },

  async getDocument(projectId: string, docNo: string): Promise<Document | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.docs.find(d => d.no === docNo) ?? null;
    }
    return apiClient.get<Document>(`/projects/${projectId}/documents/${docNo}`);
  },

  async createDocument(input: CreateDocumentInput): Promise<Document> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { ...input };
    }
    return apiClient.post<Document>(`/projects/${input.projectId}/documents`, input);
  },

  async updateDocument(projectId: string, docNo: string, data: Partial<Document>): Promise<Document> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const doc = project.docs.find(d => d.no === docNo);
      if (!doc) throw new Error('Document not found');
      return { ...doc, ...data };
    }
    return apiClient.patch<Document>(`/projects/${projectId}/documents/${docNo}`, data);
  },

  async deleteDocument(projectId: string, docNo: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/documents/${docNo}`);
  },

  async uploadDocument(projectId: string, file: File, metadata: Partial<Document>): Promise<Document> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        no: metadata.no || `DOC-${Date.now()}`,
        title: metadata.title || file.name,
        rev: metadata.rev || 'A',
        cat: metadata.cat || 'Drawings',
        status: metadata.status || 'review',
        by: metadata.by || 'Current User',
        date: new Date().toISOString().split('T')[0],
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    return apiClient.post<Document>(`/projects/${projectId}/documents/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};