import axios, { AxiosError, AxiosInstance } from 'axios';
import { Task, TaskFormData, CreateTaskInput } from '@/types/Task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:1337';

const createApiClient = () => {
  const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add auth token to requests if available
  api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  });

  // Handle response errors
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear auth data on unauthorized
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Create API client
const api = createApiClient();

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  jwt: string;
  user: User;
}

class AuthApiService {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/local', {
        identifier: email,
        password,
      });
      
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('userId', response.data.user.id.toString());
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 
                            'Login failed. Please try again.';
        console.error('Login error:', {
          status: error.response?.status,
          message: errorMessage
        });

        switch (error.response?.status) {
          case 400:
            throw new Error('Invalid request. Please check your input.');
          case 401:
            throw new Error('Unauthorized. Please check your credentials.');
          case 403:
            throw new Error('Access forbidden. Please contact support.');
          default:
            throw new Error(errorMessage);
        }
      }
      throw error;
    }
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/local/register', {
        username,
        email,
        password,
      });

      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', response.data.jwt);
        localStorage.setItem('userId', response.data.user.id.toString());
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('email', response.data.user.email);
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 
                            'Registration failed. Please try again.';
        console.error('Registration error:', {
          status: error.response?.status,
          message: errorMessage
        });

        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('jwt');
    if (!token) return null;

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!userId || !username || !email) return null;

    return {
      id: parseInt(userId),
      username,
      email,
    };
  }

  isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('jwt');
  }
}

export const authApi = new AuthApiService();

interface TaskResponse {
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

interface SingleTaskResponse {
  data: Task;
}

class TaskApiService {
  private readonly baseUrl = '/api/tasks';

  async getTasks(): Promise<TaskResponse> {
    try {
      const response = await api.get<TaskResponse>(this.baseUrl, {
        params: {
          'populate': '*',
          'sort': 'createdAt:desc'
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to fetch tasks';
        console.error('Error fetching tasks:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const response = await api.get<SingleTaskResponse>(`${this.baseUrl}/${taskId}`, {
        params: {
          'populate': '*'
        }
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to fetch task details';
        console.error('Error fetching task:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async createTask(taskData: CreateTaskInput): Promise<SingleTaskResponse> {
    try {
      const response = await api.post<SingleTaskResponse>(this.baseUrl, {
        data: {
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status || 'pending',
          startDate: taskData.startDate ? new Date(taskData.startDate).toISOString() : null,
          endDate: taskData.endDate ? new Date(taskData.endDate).toISOString() : null,
          priority: taskData.priority || 'medium',
          isOverdue: false,
        }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to create task';
        console.error('Error creating task:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async updateTask(taskId: number, taskData: TaskFormData): Promise<SingleTaskResponse> {
    try {
      // Log the request details
      console.log('Making update request:', {
        url: `${this.baseUrl}/${taskId}`,
        data: taskData,
        headers: api.defaults.headers
      });

      const response = await api.put<SingleTaskResponse>(`${this.baseUrl}/${taskId}`, {
        data: {
          title: taskData.title,
          description: taskData.description || '',
          status: taskData.status || 'pending',
          startDate: taskData.startDate ? new Date(taskData.startDate).toISOString() : null,
          endDate: taskData.endDate ? new Date(taskData.endDate).toISOString() : null,
          priority: taskData.priority || 'medium'
        }
      });

      // Log the response
      console.log('Update response:', response.data);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Log the error details
        console.error('Update error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });

        const errorMessage = error.response?.data?.error?.message || 'Failed to update task';
        console.error('Error updating task:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${taskId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error?.message || 'Failed to delete task';
        console.error('Error deleting task:', error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}

export const taskApi = new TaskApiService();

export default api;