'use client';

import { Camera, Plus, Image as ImageIcon, Search } from 'lucide-react';
import { Card, Group, Text, Button, TextInput } from '@mantine/core';
import { cn } from '@/lib/utils';
import type { Photo } from '@/types';

interface PhotosGalleryProps {
  photos: Photo[];
  onUpload?: () => void;
}

const PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  <circle cx="8.5" cy="8.5" r="1.5"/>
  <path d="M21 15l-5-5L5 21"/>
</svg>
`;

export function PhotosGallery({ photos, onUpload }: PhotosGalleryProps) {
  const [query, setQuery] = useState('');

  const filtered = photos.filter((p) => 
    query.trim() === '' || 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Photos
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Site photos attached to issues and daily logs
          </p>
        </div>
        <Button onClick={onUpload} leftSection={<Plus className="h-4 w-4" />} size="sm">
          Add photo
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="ml-auto flex items-center gap-2">
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search photos..."
            leftSection={<Search className="h-4 w-4 text-text-muted" />}
            size="sm"
            radius="md"
            className="w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card radius="xl" withBorder shadow="sm" className="p-12 text-center">
          <div className="empty-state-icon text-5xl mb-3" style={{ color: 'var(--color-border)' }}>
            {PLACEHOLDER_SVG}
          </div>
          <div className="empty-state-title text-heading-sm font-heading font-medium text-text">
            {query ? 'No photos match your search' : 'No photos yet'}
          </div>
          <div className="empty-state-description text-body-sm text-text-muted mt-1">
            {query ? 'Try a different search term' : 'Upload your first site photo to get started'}
          </div>
          {onUpload && (
            <Button onClick={onUpload} className="mt-4" size="sm" leftSection={<Plus className="h-4 w-4" />}>
              Upload photo
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((photo, i) => (
            <Card key={photo.id || i} radius="lg" withBorder shadow="sm" className="overflow-hidden hover:shadow-card-hover transition-shadow">
              <div className="aspect-[4/3] bg-background relative overflow-hidden" style={{ background: 'var(--color-border-light)' }}>
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-text-muted/30">
                    {PLACEHOLDER_SVG}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-body-xs text-white font-medium truncate">{photo.title}</div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-body-xs">
                  <span style={{ color: 'var(--color-text-muted)' }}>{photo.location}</span>
                  <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-medium" style={{ 
                    color: 'var(--color-primary)', 
                    background: 'var(--color-primary-light)' 
                  }}>
                    {photo.category}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-body-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{photo.date}</span>
                  {photo.tags.length > 0 && (
                    <span>·</span>
                  )}
                  {photo.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded-xs text-[10px]" style={{ 
                      color: 'var(--color-text-muted)', 
                      background: 'var(--color-background)' 
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}