'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { PhotosGallery } from '@/features/photos/PhotosGallery';
import { LoadingSkeleton } from '@/components/ui/States';

export default function PhotosPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: project, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" lines={2} className="max-w-xs" />
        <LoadingSkeleton variant="card" />
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

  return <PhotosGallery photos={project.photos} />;
}