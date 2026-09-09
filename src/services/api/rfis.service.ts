import type { RFI, CreateRFIInput, UpdateRFIInput, RFIFilters } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

function filterRFIs(rfis: RFI[], filters: RFIFilters): RFI[] {
  return rfis.filter(rfi => {
    if (filters.status && rfi.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!rfi.id.toLowerCase().includes(search) && !rfi.subject.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}

export const rfisService = {
  async getRFIs(projectId: string, filters?: RFIFilters): Promise<RFI[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return [];
      return filters ? filterRFIs(project.rfis, filters) : project.rfis;
    }
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    return apiClient.get<RFI[]>(`/projects/${projectId}/rfis`, { params });
  },

  async getRFI(projectId: string, id: string): Promise<RFI | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.rfis.find(r => r.id === id) ?? null;
    }
    return apiClient.get<RFI>(`/projects/${projectId}/rfis/${id}`);
  },

  async createRFI(input: CreateRFIInput): Promise<RFI> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        id: `RFI-${Date.now()}`,
        ...input,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return apiClient.post<RFI>(`/projects/${input.projectId}/rfis`, input);
  },

  async updateRFI(projectId: string, id: string, data: UpdateRFIInput): Promise<RFI> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const rfi = project.rfis.find(r => r.id === id);
      if (!rfi) throw new Error('RFI not found');
      return { ...rfi, ...data, updatedAt: new Date().toISOString() };
    }
    return apiClient.patch<RFI>(`/projects/${projectId}/rfis/${id}`, data);
  },

  async deleteRFI(projectId: string, id: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/rfis/${id}`);
  },
};