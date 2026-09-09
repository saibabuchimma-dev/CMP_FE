export type ProjectStage = 'Foundation' | 'Superstructure' | 'Finishing' | 'Handover';

export type DocumentStatus = 'approved' | 'review' | 'hold' | 'rejected';

export type DocumentCategory = 'Drawings' | 'QA/QC' | 'Contracts' | 'Progress Reports';

export type RFIStatus = 'Open' | 'Answered' | 'Closed';

export type SubmittalStatus = 'Pending' | 'Approved' | 'Approved as Noted' | 'Revise & Resubmit';

export type IssueType = 'Safety' | 'Quality' | 'Design';

export type IssuePriority = 'High' | 'Medium' | 'Low';

export type IssueStatus = 'Open' | 'In Progress' | 'Closed';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'engineer' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  location: string;
  stage: ProjectStage;
  percentComplete: number;
  docs: Document[];
  rfis: RFI[];
  submittals: Submittal[];
  issues: Issue[];
  dailyLogs: DailyLog[];
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  no: string;
  title: string;
  rev: string;
  cat: DocumentCategory;
  status: DocumentStatus;
  by: string;
  date: string;
}

export interface RFI {
  id: string;
  subject: string;
  status: RFIStatus;
  assignedTo: string;
  ballInCourt: string;
  due: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submittal {
  id: string;
  title: string;
  spec: string;
  status: SubmittalStatus;
  due: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  title: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  assignedTo: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLog {
  date: string;
  weather: string;
  temperature: string;
  manpower: number;
  summary: string;
  delays: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  location: string;
  date: string;
  category: 'Issue' | 'Daily Log' | 'Progress' | 'General';
  relatedIssueId?: string;
  relatedDailyLogId?: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface DocumentFilters {
  category?: DocumentCategory | 'All';
  status?: DocumentStatus;
  search?: string;
}

export interface RFIFilters {
  status?: RFIStatus;
  search?: string;
}

export interface SubmittalFilters {
  status?: SubmittalStatus;
  search?: string;
}

export interface IssueFilters {
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateProjectInput {
  name: string;
  location: string;
  stage: ProjectStage;
}

export interface UpdateProjectInput {
  name?: string;
  location?: string;
  stage?: ProjectStage;
  percentComplete?: number;
}

export interface CreateDocumentInput {
  projectId: string;
  no: string;
  title: string;
  rev: string;
  cat: DocumentCategory;
  status: DocumentStatus;
  by: string;
  date: string;
}

export interface CreateRFIInput {
  projectId: string;
  subject: string;
  description?: string;
  assignedTo: string;
  ballInCourt: string;
  due: string;
}

export interface UpdateRFIInput {
  subject?: string;
  description?: string;
  status?: RFIStatus;
  assignedTo?: string;
  ballInCourt?: string;
  due?: string;
}

export interface CreateSubmittalInput {
  projectId: string;
  title: string;
  spec: string;
  status: SubmittalStatus;
  due: string;
  description?: string;
}

export interface UpdateSubmittalInput {
  title?: string;
  spec?: string;
  status?: SubmittalStatus;
  due?: string;
  description?: string;
}

export interface CreateIssueInput {
  projectId: string;
  title: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  assignedTo: string;
  description?: string;
  date: string;
}

export interface UpdateIssueInput {
  title?: string;
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  location?: string;
  assignedTo?: string;
  description?: string;
}

export interface CreateDailyLogInput {
  projectId: string;
  date: string;
  weather: string;
  temperature: string;
  manpower: number;
  summary: string;
  delays: string;
}

export interface CreatePhotoInput {
  projectId: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  location: string;
  date: string;
  category: Photo['category'];
  relatedIssueId?: string;
  relatedDailyLogId?: string;
  tags?: string[];
  uploadedBy: string;
}