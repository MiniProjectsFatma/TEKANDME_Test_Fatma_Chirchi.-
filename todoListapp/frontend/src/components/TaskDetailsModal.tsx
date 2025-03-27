'use client';

import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Task, TaskFormData } from '@/types/Task';
import { taskApi } from '@/services/api';

interface TaskDetailsModalProps {
  show: boolean;
  onHide: () => void;
  task: Task;
  onUpdate: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ show, onHide, task, onUpdate }) => {
  const [editedTask, setEditedTask] = useState<TaskFormData>({
    title: task.attributes.title,
    description: task.attributes.description || '',
    status: task.attributes.status,
    priority: task.attributes.priority,
    startDate: task.attributes.startDate,
    endDate: task.attributes.endDate || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taskApi.updateTask(task.id, editedTask);
      onUpdate();
      onHide();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await taskApi.deleteTask(task.id);
      onUpdate();
      onHide();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({ ...prev, [name]: value }));
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Edit Task' : 'Task Details'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            {isEditing ? (
              <Form.Control
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            ) : (
              <div className="form-control-plaintext">
                {task.attributes.title}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            {isEditing ? (
              <Form.Control
                as="textarea"
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows={3}
                disabled={loading}
              />
            ) : (
              <div className="form-control-plaintext">
                {task.attributes.description || 'No description'}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            {isEditing ? (
              <Form.Select
                name="priority"
                value={editedTask.priority}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            ) : (
              <div>
                <Badge bg={getPriorityBadgeVariant(task.attributes.priority)}>
                  {task.attributes.priority}
                </Badge>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            {isEditing ? (
              <Form.Select
                name="status"
                value={editedTask.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Form.Select>
            ) : (
              <div>
                <Badge bg={task.attributes.status === 'completed' ? 'success' : 'warning'}>
                  {task.attributes.status}
                </Badge>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            {isEditing ? (
              <Form.Control
                type="date"
                name="startDate"
                value={editedTask.startDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            ) : (
              <div className="form-control-plaintext">
                {new Date(task.attributes.startDate).toLocaleDateString()}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Due Date</Form.Label>
            {isEditing ? (
              <Form.Control
                type="date"
                name="endDate"
                value={editedTask.endDate}
                onChange={handleChange}
                min={editedTask.startDate}
                disabled={loading}
              />
            ) : (
              <div className="form-control-plaintext">
                {task.attributes.endDate
                  ? new Date(task.attributes.endDate).toLocaleDateString()
                  : 'No due date'}
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="flex-grow-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  className="flex-grow-1"
                >
                  Edit Task
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskDetailsModal;