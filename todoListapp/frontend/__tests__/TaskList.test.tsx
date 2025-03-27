import React from 'react';
import TaskList from '../components/TaskList';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Mock the taskService to avoid real API calls
jest.mock('../services/taskService', () => ({
  taskService: {
    getTasks: jest.fn(() => Promise.resolve([])),
    createTask: jest.fn(() => Promise.resolve({})),
    updateTask: jest.fn(() => Promise.resolve({})),
    deleteTask: jest.fn(() => Promise.resolve({}))
  }
}));

describe('TaskList Component', () => {
  it('renders task creation form', async () => {
    render(<TaskList />);
    
    // Use findBy or waitFor for async rendering
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Titre de la tâche')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
      expect(screen.getByText('Créer une tâche')).toBeInTheDocument();
    });
  });

  it('allows entering a new task', async () => {
    render(<TaskList />);
    
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('Titre de la tâche');
      const descriptionInput = screen.getByPlaceholderText('Description');

      fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      
      expect(titleInput).toHaveValue('New Test Task');
      expect(descriptionInput).toHaveValue('Test Description');
    });
  });
});