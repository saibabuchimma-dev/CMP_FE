import type { DocumentCategory, DocumentStatus, RFIStatus, SubmittalStatus, IssueType, IssuePriority, IssueStatus, ProjectStage } from '@/types';

export const PROJECT_STAGES: ProjectStage[] = ['Foundation', 'Superstructure', 'Finishing', 'Handover'];

export const STAGE_COLORS: Record<ProjectStage, string> = {
  Foundation: '#8A6A1E',
  Superstructure: '#AE4E22',
  Finishing: '#2B4E68',
  Handover: '#3E6B4C',
};

export const STAGE_LABELS: Record<ProjectStage, string> = {
  Foundation: 'Foundation',
  Superstructure: 'Superstructure',
  Finishing: 'Finishing',
  Handover: 'Handover',
};

export const DOCUMENT_CATEGORIES: (DocumentCategory | 'All')[] = ['All', 'Drawings', 'QA/QC', 'Contracts', 'Progress Reports'];

export const DOCUMENT_CATEGORY_ICONS: Record<DocumentCategory, string> = {
  Drawings: 'Layers',
  'QA/QC': 'ClipboardCheck',
  Contracts: 'FileText',
  'Progress Reports': 'FolderOpen',
};

export const DOCUMENT_STATUSES: DocumentStatus[] = ['approved', 'review', 'hold', 'rejected'];

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string; icon: string }> = {
  approved: { label: 'Approved', color: '#3F7352', bg: '#E8F0E8', icon: 'CheckCircle2' },
  review: { label: 'In Review', color: '#3D6680', bg: '#E7EFF4', icon: 'Clock' },
  hold: { label: 'On Hold', color: '#A57920', bg: '#F5EEDC', icon: 'PauseCircle' },
  rejected: { label: 'Rejected', color: '#A74732', bg: '#F6E8E3', icon: 'XCircle' },
};

export const RFI_STATUSES: RFIStatus[] = ['Open', 'Answered', 'Closed'];

export const RFI_STATUS_CONFIG: Record<RFIStatus, { color: string; bg: string }> = {
  Open: { color: '#3D6680', bg: '#E7EFF4' },
  Answered: { color: '#A57920', bg: '#F5EEDC' },
  Closed: { color: '#3F7352', bg: '#E8F0E8' },
};

export const SUBMITTAL_STATUSES: SubmittalStatus[] = ['Pending', 'Approved', 'Approved as Noted', 'Revise & Resubmit'];

export const SUBMITTAL_STATUS_CONFIG: Record<SubmittalStatus, { color: string; bg: string }> = {
  Pending: { color: '#A57920', bg: '#F5EEDC' },
  Approved: { color: '#3F7352', bg: '#E8F0E8' },
  'Approved as Noted': { color: '#A57920', bg: '#F5EEDC' },
  'Revise & Resubmit': { color: '#A74732', bg: '#F6E8E3' },
};

export const ISSUE_TYPES: IssueType[] = ['Safety', 'Quality', 'Design'];

export const ISSUE_TYPE_COLORS: Record<IssueType, string> = {
  Safety: '#A74732',
  Quality: '#AE4E22',
  Design: '#2B4E68',
};

export const ISSUE_PRIORITIES: IssuePriority[] = ['High', 'Medium', 'Low'];

export const ISSUE_PRIORITY_COLORS: Record<IssuePriority, string> = {
  High: '#8C3131',
  Medium: '#AE4E22',
  Low: '#6B6A63',
};

export const ISSUE_STATUSES: IssueStatus[] = ['Open', 'In Progress', 'Closed'];

export const ISSUE_STATUS_CONFIG: Record<IssueStatus, { color: string; bg: string }> = {
  Open: { color: '#3D6680', bg: '#E7EFF4' },
  'In Progress': { color: '#A57920', bg: '#F5EEDC' },
  Closed: { color: '#3F7352', bg: '#E8F0E8' },
};

export const PROJECT_NAVIGATION = [
  { key: 'overview', label: 'Overview', icon: 'LayoutGrid', href: '/projects/[projectId]' },
  { key: 'files', label: 'Files', icon: 'FolderOpen', href: '/projects/[projectId]/files' },
  { key: 'rfis', label: 'RFIs', icon: 'FileSearch', href: '/projects/[projectId]/rfis' },
  { key: 'submittals', label: 'Submittals', icon: 'ClipboardCheck', href: '/projects/[projectId]/submittals' },
  { key: 'issues', label: 'Issues', icon: 'AlertTriangle', href: '/projects/[projectId]/issues' },
  { key: 'photos', label: 'Photos', icon: 'Camera', href: '/projects/[projectId]/photos' },
  { key: 'dailyLog', label: 'Daily Log', icon: 'CalendarDays', href: '/projects/[projectId]/daily-log' },
  { key: 'insights', label: 'Insights', icon: 'BarChart3', href: '/projects/[projectId]/insights' },
] as const;

export const HUB_NAVIGATION = [
  { key: 'projects', label: 'Projects', icon: 'LayoutGrid', href: '/projects' },
  { key: 'settings', label: 'Settings', icon: 'Settings', href: '/settings' },
] as const;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMM D, YYYY';

export const TABLE_PAGE_SIZE = 25;

export const DEMO_USER = {
  id: 'user-1',
  email: 'engineer@basalt.demo',
  name: 'Demo Engineer',
  role: 'engineer' as const,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'build-better-auth-token',
  USER: 'build-better-user',
  SELECTED_PROJECT: 'build-better-selected-project',
  SIDEBAR_OPEN: 'build-better-sidebar-open',
  THEME: 'build-better-theme',
} as const;