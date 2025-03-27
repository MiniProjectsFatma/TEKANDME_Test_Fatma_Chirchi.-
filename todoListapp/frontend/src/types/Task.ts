export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  startDate: string | null;
  endDate: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  documentId?: string;
  taskUid?: string | null;
  isOverdue?: boolean;
  owner?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
  };
}

export interface TaskFormData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  startDate?: string | null;
  endDate?: string | null;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskResponse {
  data: Task[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleTaskResponse {
  data: Task;
  meta: {};
}

export interface CreateTaskInput extends TaskFormData {}
