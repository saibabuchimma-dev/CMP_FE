'use client';

import { useState, useMemo } from 'react';
import { 
  Camera, 
  Plus, 
  Search, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Tag, 
  Download, 
  Maximize2, 
  Filter, 
  HardHat, 
  CheckCircle2, 
  ExternalLink,
  Eye,
  Layers
} from 'lucide-react';
import { Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import type { Photo } from '@/types';

interface PhotosGalleryProps {
  photos: Photo[];
  onUpload?: () => void;
}

const DEFAULT_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=1000&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80',
  'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000&q=80',
  'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=1000&q=80'
];

export function PhotosGallery({ photos: initialPhotos, onUpload }: PhotosGalleryProps) {
  const [photoList, setPhotoList] = useState<Photo[]>(initialPhotos);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [query, setQuery] = useState('');

  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Tower B, Level 14');
  const [newCategory, setNewCategory] = useState<Photo['category']>('Progress');
  const [newImageUrl, setNewImageUrl] = useState(DEFAULT_SAMPLE_PHOTOS[0]);
  const [newTags, setNewTags] = useState('inspection, structural, rebar');

  const filtered = useMemo(() => {
    return photoList.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchQuery = query.trim() === '' || 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) ||
        (p.uploadedBy && p.uploadedBy.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [photoList, categoryFilter, query]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    photoList.forEach(p => { if (p.category) cats.add(p.category); });
    return ['All', ...Array.from(cats)];
  }, [photoList]);

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPhoto: Photo = {
      id: `PH-${Math.floor(400 + Math.random() * 600)}`,
      url: newImageUrl,
      thumbnailUrl: newImageUrl,
      title: newTitle.trim(),
      location: newLocation.trim() || 'General Site Area',
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['site-photo'],
      uploadedBy: 'Current Inspector (QA/QC)',
      createdAt: new Date().toISOString(),
    };

    setPhotoList(prev => [newPhoto, ...prev]);

    notifications.show({
      title: 'Site Photo Uploaded',
      message: `"${newPhoto.title}" logged under ${newPhoto.category} at ${newPhoto.location}.`,
      color: 'blue',
    });

    setNewTitle('');
    setUploadModalOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-info bg-info-bg uppercase tracking-wider mb-2">
            <Camera className="h-3 w-3" />
            Field Progress & Visual Records
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Site Photo Gallery & Inspections
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            High-resolution field photographs geotagged to structural elements, punch items, concrete pours, and QA inspections.
          </p>
        </div>
        <button
          onClick={() => (onUpload ? onUpload() : setUploadModalOpen(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-surface hover:bg-primary/90 font-medium text-body-sm transition-all shadow-sm active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Site Photo</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            const count = cat === 'All' 
              ? photoList.length 
              : photoList.filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 text-body-xs font-semibold rounded-xl transition-all shrink-0 p-2',
                  isActive
                    ? 'bg-primary text-surface shadow-xs'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                <span>{cat}</span>
                <span className={cn('text-[11px] font-mono px-2 py-0.5 rounded-md font-bold', isActive ? 'bg-white/20' : 'bg-border-light text-text-muted')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>


        <div className="w-full sm:w-80">
  <div className="relative w-full">
    <Search
      className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
      style={{ left: '14px' }}
    />

    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search by tag, location, title..."
      className="w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs shadow-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
      style={{ paddingLeft: '46px' }}
    />
  </div>
</div>

      </div>

      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-surface shadow-xs">
          <ImageIcon className="h-12 w-12 mx-auto text-text-muted/50 mb-3" />
          <h3 className="text-heading-sm font-semibold text-text">No photographs found</h3>
          <p className="text-body-sm text-text-muted mt-1 max-w-sm mx-auto">
            {query ? 'No site photos matched your search term.' : 'Start creating an immutable visual timeline by uploading site photos.'}
          </p>
          <button
            onClick={() => (onUpload ? onUpload() : setUploadModalOpen(true))}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-primary text-surface text-body-sm font-semibold hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group cursor-pointer rounded-2xl border border-border bg-surface overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[16/10] bg-background relative overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface/90 text-primary backdrop-blur-xs shadow-xs">
                    {photo.category}
                  </span>
                </div>

                <div className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-4 w-4" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white text-body-sm font-semibold line-clamp-1 group-hover:text-primary-light transition-colors">
                    {photo.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface border-t border-border flex flex-col justify-between flex-1 gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span className="font-mono">{formatDate(photo.date)}</span>
                  {photo.uploadedBy && (
                    <span className="truncate max-w-[120px] font-medium">{photo.uploadedBy}</span>
                  )}
                </div>

                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-background border border-border text-text-secondary font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-[10px] text-text-muted self-center">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        opened={!!activePhoto}
        onClose={() => setActivePhoto(null)}
        size="xl"
        centered
        padding={0}
        withCloseButton={false}
        styles={{
          content: { overflow: 'hidden', borderRadius: '16px' },
        }}
      >
        {activePhoto && (
          <div>
            <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="w-full max-h-[65vh] object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-surface border-t border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-primary bg-primary/10 mb-1">
                    {activePhoto.category}
                  </div>
                  <h3 className="text-heading-sm font-semibold text-text">
                    {activePhoto.title}
                  </h3>
                </div>
                <a
                  href={activePhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-background border border-border text-body-xs font-medium text-text hover:bg-surface transition-all shrink-0 self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5 text-text-muted" />
                  <span>Download Full Res</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-background border border-border text-body-xs">
                <div>
                  <div className="text-[11px] text-text-muted">Location</div>
                  <div className="font-semibold text-text mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-text-muted shrink-0" />
                    <span className="truncate">{activePhoto.location}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted">Capture Date</div>
                  <div className="font-semibold text-text mt-0.5 font-mono">
                    {formatDate(activePhoto.date, 'long')}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted">Inspector / Trade</div>
                  <div className="font-semibold text-text mt-0.5 flex items-center gap-1">
                    <HardHat className="h-3 w-3 text-text-muted shrink-0" />
                    <span className="truncate">{activePhoto.uploadedBy || 'Site Team'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted">Photo ID</div>
                  <div className="font-semibold text-primary mt-0.5 font-mono">
                    {activePhoto.id}
                  </div>
                </div>
              </div>

              {activePhoto.tags && activePhoto.tags.length > 0 && (
                <div className="flex items-center gap-2 text-body-xs">
                  <Tag className="h-3.5 w-3.5 text-text-muted shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {activePhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] bg-background border border-border text-text-secondary font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-text">
            <Camera className="h-5 w-5 text-primary" />
            <span>Upload Site Photo</span>
          </div>
        }
        size="lg"
        centered
        styles={{
          header: { borderBottom: '1px solid var(--color-border)', padding: '16px 24px' },
          body: { padding: '24px' },
        }}
      >
        <form onSubmit={handleUploadPhoto} className="space-y-4">
          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Photo Title / Inspection Description *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Level 14 Beam Reinforcement pre-pour inspection"
              className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Progress">Progress</option>
                <option value="Issue">Issue / Snag</option>
                <option value="Daily Log">Daily Log</option>
                <option value="QA/QC">QA/QC</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Location / Grid Line
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Core C, Floor 14"
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Select Sample Construction Photo (High Res)
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {DEFAULT_SAMPLE_PHOTOS.map((sampleUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setNewImageUrl(sampleUrl)}
                  className={cn(
                    'aspect-video rounded-md overflow-hidden border-2 cursor-pointer transition-all',
                    newImageUrl === sampleUrl
                      ? 'border-primary shadow-xs ring-2 ring-primary/20'
                      : 'border-border opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={sampleUrl} alt="Sample preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <input
              type="url"
              required
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste an image URL..."
              className="w-full px-3.5 py-2 text-body-xs bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="e.g. concrete, foundation, rebar, slab"
              className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-body-sm font-medium text-text hover:bg-background transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-surface text-body-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
            >
              Upload Photo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}