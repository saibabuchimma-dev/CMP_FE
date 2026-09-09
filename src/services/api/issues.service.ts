import type { Issue, CreateIssueInput, UpdateIssueInput, IssueFilters } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

function filterIssues(issues: Issue[], filters: IssueFilters): Issue[] {
  return issues.filter(issue => {
    if (filters.type && issue.type !== filters.type) return false;
    if (filters.priority && issue.priority !== filters.priority) return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!issue.id.toLowerCase().includes(search) && !issue.title.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}

export const issuesService = {
  async getIssues(projectId: string, filters?: IssueFilters): Promise<Issue[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return [];
      return filters ? filterIssues(project.issues, filters) : project.issues;
    }
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    return apiClient.get<Issue[]>(`/projects/${projectId}/issues`, { params });
  },

  async getIssue(projectId: string, id: string): Promise<Issue | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.issues.find(i => i.id === id) ?? null;
    }
    return apiClient.get<Issue>(`/projects/${projectId}/issues/${id}`);
  },

  async createIssue(input: CreateIssueInput): Promise<Issue> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        id: `ISS-${Date.now()}`,
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return apiClient.post<Issue>(`/projects/${input.projectId}/issues`, input);
  },

  async updateIssue(projectId: string, id: string, data: UpdateIssueInput): Promise<Issue> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const issue = project.issues.find(i => i.id === id);
      if (!issue) throw new Error('Issue not found');
      return { ...issue, ...data, updatedAt: new Date().toISOString() };
    }
    return apiClient.patch<Issue>(`/projects/${projectId}/issues/${id}`, data);
  },

  async deleteIssue(projectId: string, id: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/issues/${id}`);
  },
};