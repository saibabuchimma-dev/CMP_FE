import type { Photo, CreatePhotoInput } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

export const photosService = {
  async getPhotos(projectId: string): Promise<Photo[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      return project?.photos ?? [];
    }
    return apiClient.get<Photo[]>(`/projects/${projectId}/photos`);
  },

  async getPhoto(projectId: string, id: string): Promise<Photo | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.photos.find(p => p.id === id) ?? null;
    }
    return apiClient.get<Photo>(`/projects/${projectId}/photos/${id}`);
  },

  async createPhoto(input: CreatePhotoInput): Promise<Photo> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: `PHOTO-${Date.now()}`,
        ...input,
        tags: input.tags ?? [],
        createdAt: new Date().toISOString(),
      };
    }
    return apiClient.post<Photo>(`/projects/${input.projectId}/photos`, input);
  },

  async updatePhoto(projectId: string, id: string, data: Partial<Photo>): Promise<Photo> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const photo = project.photos.find(p => p.id === id);
      if (!photo) throw new Error('Photo not found');
      return { ...photo, ...data };
    }
    return apiClient.patch<Photo>(`/projects/${projectId}/photos/${id}`, data);
  },

  async deletePhoto(projectId: string, id: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/photos/${id}`);
  },

  async uploadPhoto(projectId: string, file: File, metadata: Partial<CreatePhotoInput>): Promise<Photo> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: `PHOTO-${Date.now()}`,
        url: URL.createObjectURL(file),
        title: metadata.title || file.name,
        location: metadata.location || 'Unknown',
        date: metadata.date || new Date().toISOString().split('T')[0],
        category: metadata.category || 'Progress',
        tags: metadata.tags || [],
        uploadedBy: metadata.uploadedBy || 'Current User',
        createdAt: new Date().toISOString(),
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    return apiClient.post<Photo>(`/projects/${projectId}/photos/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};