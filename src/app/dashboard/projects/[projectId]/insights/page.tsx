'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { InsightsCharts } from '@/features/insights/InsightsCharts';
import { LoadingSkeleton } from '@/components/ui/States';

export default function InsightsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" lines={2} className="max-w-xs" />
        <div className="grid gap-4 lg:grid-cols-2">
          <LoadingSkeleton key="a" variant="card" />
          <LoadingSkeleton key="b" variant="card" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <LoadingSkeleton key="c" variant="card" />
          <LoadingSkeleton key="d" variant="card" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state py-12">
        <div className="empty-state-icon text-5xl mb-3">📁</div>
        <div className="empty-state-title text-heading-sm font-heading font-medium text-text">Project not found</div>
      </div>
    );
  }

  return <InsightsCharts project={project} />;
}