'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/Task';
import { taskApi } from '@/services/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import TaskCalendar from '@/components/TaskCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize notifications
  useNotifications(tasks);

  useEffect(() => {
    // Check authentication first
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      
      // If authenticated, load tasks
      loadTasks();
    }
  }, [user, authLoading, router]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getTasks();
      setTasks(response.data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      if (err instanceof Error && err.message.includes('authentication')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = () => {
    setShowAddForm(false);
    loadTasks();
  };

  if (authLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col>
          <h1 className="h3">Task Dashboard</h1>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Task
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <TaskList
            tasks={tasks}
            loading={loading}
            onTaskUpdate={loadTasks}
          />
        </Col>
      </Row>

      <TaskForm
        show={showAddForm}
        onHide={() => setShowAddForm(false)}
        onSave={handleTaskAdded}
      />
    </Container>
  );
}
