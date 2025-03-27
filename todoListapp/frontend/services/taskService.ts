// frontend/services/taskService.ts
import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:1337';

export const taskService = {
  // Create a new task
  createTask: async (task: Task) => {
    try {
      const response = await axios.post(`${API_URL}/api/tasks`, {
        data: {
          title: task.title,
          description: task.description,
          status: task.status || 'pending',
          priority: task.priority,
          startDate: task.startDate,
          endDate: task.endDate,
          isOverdue: task.isOverdue || false
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get all tasks
  getTasks: async (filters: { 
    status?: 'pending' | 'completed', 
    search?: string 
  } = {}) => {
    try {
      let url = `${API_URL}/api/tasks?populate=*`;
      
      if (filters.status) {
        url += `&filters[status][$eq]=${filters.status}`;
      }
      
      if (filters.search) {
        url += `&filters[$or][0][title][$containsi]=${filters.search}`;
        url += `&filters[$or][1][description][$containsi]=${filters.search}`;
      }

      const response = await axios.get(url);
      return response.data.data.map((item: any) => ({
        id: item.id,
        ...item.attributes
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id: number, task: Partial<Task>) => {
    try {
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, {
        data: task
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};