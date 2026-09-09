import type { Project, CreateProjectInput, UpdateProjectInput, PaginatedResponse } from '@/types';
import { apiClient } from './axios';
import { DEMO_PROJECTS, getProjectById, getAllProjects } from '@/data/projects';

const USE_DEMO_DATA = true;

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getAllProjects();
    }
    return apiClient.get<Project[]>('/projects');
  },

  async getProject(id: string): Promise<Project | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return getProjectById(id) ?? null;
    }
    return apiClient.get<Project>(`/projects/${id}`);
  },

  async createProject(input: CreateProjectInput): Promise<Project> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newProject: Project = {
        id: `p${Date.now()}`,
        ...input,
        percentComplete: 0,
        docs: [],
        rfis: [],
        submittals: [],
        issues: [],
        dailyLogs: [],
        photos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newProject;
    }
    return apiClient.post<Project>('/projects', input);
  },

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const project = getProjectById(id);
      if (!project) throw new Error('Project not found');
      return { ...project, ...input, updatedAt: new Date().toISOString() };
    }
    return apiClient.patch<Project>(`/projects/${id}`, input);
  },

  async deleteProject(id: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${id}`);
  },
};