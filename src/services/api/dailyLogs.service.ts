import type { DailyLog, CreateDailyLogInput } from '@/types';
import { apiClient } from './axios';

const USE_DEMO_DATA = true;

export const dailyLogsService = {
  async getDailyLogs(projectId: string): Promise<DailyLog[]> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      return project?.dailyLogs ?? [];
    }
    return apiClient.get<DailyLog[]>(`/projects/${projectId}/daily-logs`);
  },

  async getDailyLog(projectId: string, date: string): Promise<DailyLog | null> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) return null;
      return project.dailyLogs.find(d => d.date === date) ?? null;
    }
    return apiClient.get<DailyLog>(`/projects/${projectId}/daily-logs/${date}`);
  },

  async createDailyLog(input: CreateDailyLogInput): Promise<DailyLog> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        ...input,
        createdAt: new Date().toISOString(),
      };
    }
    return apiClient.post<DailyLog>(`/projects/${input.projectId}/daily-logs`, input);
  },

  async updateDailyLog(projectId: string, date: string, data: Partial<DailyLog>): Promise<DailyLog> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const { getProjectById } = await import('@/data/projects');
      const project = getProjectById(projectId);
      if (!project) throw new Error('Project not found');
      const log = project.dailyLogs.find(d => d.date === date);
      if (!log) throw new Error('Daily log not found');
      return { ...log, ...data };
    }
    return apiClient.patch<DailyLog>(`/projects/${projectId}/daily-logs/${date}`, data);
  },

  async deleteDailyLog(projectId: string, date: string): Promise<void> {
    if (USE_DEMO_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return;
    }
    return apiClient.delete<void>(`/projects/${projectId}/daily-logs/${date}`);
  },
};