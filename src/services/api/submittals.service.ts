import type { Submittal, CreateSubmittalInput, UpdateSubmittalInput, SubmittalFilters } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

function filterSubmittals(submittals: Submittal[], filters: SubmittalFilters): Submittal[] {
  return submittals.filter(s => {
    if (filters.status && s.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!s.id.toLowerCase().includes(search) && !s.title.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}

export const submittalsService = {
  async getSubmittals(projectId: string, filters?: SubmittalFilters): Promise<Submittal[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return [];
      return filters ? filterSubmittals(project.submittals, filters) : project.submittals;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    return apiClient.get<Submittal[]>(`/projects/${projectId}/submittals`, { params });
  },

  async getSubmittal(projectId: string, id: string): Promise<Submittal | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.submittals.find(s => s.id === id) ?? null;
    }
    return apiClient.get<Submittal>(`/projects/${projectId}/submittals/${id}`);
  },

  async createSubmittal(input: CreateSubmittalInput): Promise<Submittal> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        id: `SUB-${Date.now()}`,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return apiClient.post<Submittal>(`/projects/${input.projectId}/submittals`, input);
  },

  async updateSubmittal(projectId: string, id: string, data: UpdateSubmittalInput): Promise<Submittal> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const submittal = project.submittals.find(s => s.id === id);
      if (!submittal) throw new Error('Submittal not found');
      return { ...submittal, ...data, updatedAt: new Date().toISOString() };
    }
    return apiClient.patch<Submittal>(`/projects/${projectId}/submittals/${id}`, data);
  },

  async deleteSubmittal(projectId: string, id: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/submittals/${id}`);
  },
};