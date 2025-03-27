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

export default function Home() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Initialize notifications
  useNotifications(tasks);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load tasks when component mounts
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTasks();
      // The response has a data property that contains the tasks array
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = () => {
    loadTasks();
    setShowAddForm(false);
  };

  if (authLoading) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!user) {
    return null; // Will be redirected to login
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">My Tasks</h1>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Hide Form' : 'Add Task'}
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {showAddForm && (
        <Row className="mb-4">
          <Col>
            <TaskForm 
              show={showAddForm}
              onHide={() => setShowAddForm(false)}
              onSave={() => setShowAddForm(false)}
              onSuccess={handleTaskAdded} 
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col md={8}>
          <TaskList
            tasks={tasks}
            loading={loading}
            onTaskUpdate={loadTasks}
          />
        </Col>
        <Col md={4}>
          <TaskCalendar tasks={tasks} />
        </Col>
      </Row>
    </Container>
  );
}
