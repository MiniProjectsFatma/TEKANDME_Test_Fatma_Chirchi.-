import axios from 'axios';
import { Task } from '@/types/Task';

const API_URL = 'http://localhost:1337';

const transformStrapiResponse = (data: any): Task => ({
  id: data.id,
  ...data.attributes
});

export const taskService = {
  async getTasks(filters?: { status?: string; search?: string }): Promise<Task[]> {
    try {
      let url = `${API_URL}/api/tasks`;
      const params: any = {};
      
      if (filters?.status) {
        params.filters = { status: { $eq: filters.status } };
      }
      
      if (filters?.search) {
        params.filters = {
          ...params.filters,
          $or: [
            { title: { $containsi: filters.search } },
            { description: { $containsi: filters.search } }
          ]
        };
      }

      const response = await axios.get(url, { params });
      return response.data.data.map(transformStrapiResponse);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async getTasksByDate(date: string): Promise<Task[]> {
    try {
      const response = await axios.get(`${API_URL}/api/tasks`, {
        params: {
          filters: {
            $or: [
              {
                startDate: {
                  $lte: date
                },
                endDate: {
                  $gte: date
                }
              }
            ]
          }
        }
      });
      return response.data.data.map(transformStrapiResponse);
    } catch (error) {
      console.error('Error fetching tasks by date:', error);
      throw error;
    }
  },

  async createTask(task: Partial<Task>): Promise<Task> {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        data: task
      });
      return transformStrapiResponse(response.data.data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, {
        data: task
      });
      return transformStrapiResponse(response.data.data);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
