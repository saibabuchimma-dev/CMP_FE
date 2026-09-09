import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';

interface ProjectState {
  selectedProjectId: string | null;
  selectedProject: Project | null;
  recentProjects: string[];
  setSelectedProject: (project: Project | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  addRecentProject: (id: string) => void;
  clearRecentProjects: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      selectedProjectId: null,
      selectedProject: null,
      recentProjects: [],
      setSelectedProject: (project) => set({ 
        selectedProject: project, 
        selectedProjectId: project?.id ?? null,
        recentProjects: project ? [project.id, ...get().recentProjects.filter(id => id !== project.id)].slice(0, 5) : get().recentProjects
      }),
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      addRecentProject: (id) => set((state) => ({
        recentProjects: [id, ...state.recentProjects.filter(existing => existing !== id)].slice(0, 5)
      })),
      clearRecentProjects: () => set({ recentProjects: [] }),
    }),
    {
      name: 'build-better-project',
      partialize: (state) => ({ 
        selectedProjectId: state.selectedProjectId,
        recentProjects: state.recentProjects,
      }),
    }
  )
);