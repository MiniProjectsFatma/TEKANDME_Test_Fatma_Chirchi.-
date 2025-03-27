'use client';

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Task } from '@/types/Task';
import { taskApi } from '@/services/api';
import TaskEditModal from './TaskEditModal';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onTaskUpdate }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleStatusToggle = async (task: Task) => {
    try {
      const currentStatus = task.status || 'pending';
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      await taskApi.updateTask(task.id, { 
        ...task,
        status: newStatus 
      });
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        onTaskUpdate();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getWeekDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentDay = today.getDay();
    const result = [];
    
    // Get days before today (up to 3)
    for (let i = 3; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push({
        date,
        day: days[date.getDay()],
        isToday: false
      });
    }
    
    // Add today
    result.push({
      date: today,
      day: days[currentDay],
      isToday: true
    });
    
    // Get days after today (up to 3)
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push({
        date,
        day: days[date.getDay()],
        isToday: false
      });
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading tasks...</span>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <div className="todo-logo">
          <img src="/todo-icon.svg" alt="Todo App" width="32" height="32" />
          <h1 className="todo-title">Todo List</h1>
        </div>
        <div className="todo-date">
          {selectedDate.toLocaleDateString('en-US', { 
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-grid">
          {getWeekDays().map((dayInfo, index) => (
            <div 
              key={index}
              className={`calendar-day-wrapper ${dayInfo.isToday ? 'current' : ''}`}
              onClick={() => setSelectedDate(dayInfo.date)}
            >
              <div className="calendar-day-name">{dayInfo.day}</div>
              <div className="calendar-day-number">{dayInfo.date.getDate()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="todo-tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-card-header">
              <h3 className="task-title">{task.title}</h3>
              <span 
                className={`task-status status-${task.status || 'pending'}`}
                onClick={() => handleStatusToggle(task)}
              >
                {task.status || 'pending'}
              </span>
            </div>
            <p className="task-description">
              {task.description || 'No description provided'}
            </p>
            <div className="task-dates">
              <span>Start: {formatDate(task.startDate)}</span>
              {task.endDate && (
                <span>Due: {formatDate(task.endDate)}</span>
              )}
            </div>
            <div className="task-actions mt-3">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setEditingTask(task)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="todo-footer">
        <div className="tasks-count">
          <div className="count-box count-pending">
            {pendingTasks} Pending
          </div>
          <div className="count-box count-completed">
            {completedTasks} Completed
          </div>
        </div>
        <div className="copyright">
          &copy; 2024 Todo List. All Rights Reserved.
        </div>
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          show={true}
          onHide={() => setEditingTask(null)}
          onSave={() => {
            onTaskUpdate();
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;