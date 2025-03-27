'use client';

import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Task, TaskFormData } from '@/types/Task';
import { taskApi } from '@/services/api';

interface TaskEditModalProps {
  task: Task;
  show: boolean;
  onHide: () => void;
  onSave: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  show,
  onHide,
  onSave,
}) => {
  // Get task data and ID, handling both direct and nested formats
  const taskData = task.data?.attributes || task;
  const taskId = task.data?.id || task.id;

  const [formData, setFormData] = useState<TaskFormData>({
    title: taskData.title || '',
    description: taskData.description || '',
    status: taskData.status || 'pending',
    startDate: taskData.startDate ? new Date(taskData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: taskData.endDate ? new Date(taskData.endDate).toISOString().split('T')[0] : '',
    priority: taskData.priority || 'medium',
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!taskId) {
        throw new Error('Task ID is missing');
      }

      // Log the task ID and data being sent
      console.log('Updating task:', { taskId, formData });

      await taskApi.updateTask(Number(taskId), {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null
      });
      
      onSave();
      onHide();
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={submitting}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={submitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              disabled={submitting}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskEditModal;
