'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { taskApi } from '@/services/api';
import TaskEditModal from './TaskEditModal';
import TaskCalendar from './TaskCalendar';
import { FaEdit, FaTrash, FaCheck, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onTaskUpdate }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStatusToggle = async (task: Task) => {
    try {
      const currentStatus = task.status || 'pending';
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      // Get task ID safely, ensuring it's a number
      const taskId = task.data?.id ?? task.id;
      
      if (typeof taskId !== 'number') {
        console.error('Invalid task ID:', taskId);
        return;
      }
      
      await taskApi.updateTask(taskId, { 
        status: newStatus,
        title: task.data?.attributes?.title ?? task.title,
        description: task.data?.attributes?.description ?? task.description ?? '',
        startDate: task.data?.attributes?.startDate ?? task.startDate ?? null,
        endDate: task.data?.attributes?.endDate ?? task.endDate ?? null,
        priority: task.data?.attributes?.priority ?? task.priority ?? 'medium'
      });
      
      onTaskUpdate();
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task status');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditClose = () => {
    setEditingTask(null);
  };

  const handleEditSave = () => {
    setEditingTask(null);
    onTaskUpdate();
  };

  const handleDeleteTask = async (taskId: number | undefined) => {
    try {
      if (typeof taskId !== 'number') {
        console.error('Invalid task ID for deletion:', taskId);
        return;
      }
      
      await taskApi.deleteTask(taskId);
      onTaskUpdate();
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await taskApi.createTask({
        title: taskTitle,
        description: taskDetail,
        status: 'pending',
        priority: 'medium',
        startDate: new Date().toISOString(),
        endDate: null
      });
      setTaskTitle('');
      setTaskDetail('');
      onTaskUpdate();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isTaskUrgent = (task: Task) => {
    if (!task.endDate) return false;
    const dueDate = new Date(task.endDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.status === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

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
        <div className="welcome-section">
          <h1>Hello, Aqeel</h1>
          <p className="subtitle">Start planning today</p>
        </div>
        <div className="task-input-section">
          <div className="task-inputs">
            <input
              type="text"
              placeholder="Type Title Of Task"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="task-title-input"
            />
            <input
              type="text"
              placeholder="Detail Of Your Task"
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
              className="task-detail-input"
            />
          </div>
          <button className="add-task-btn" onClick={handleAddTask}>+</button>
        </div>
        <div className="calendar-section">
          <div className="calendar-wrapper">
            <h2 className="date-heading">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <TaskCalendar tasks={tasks} />
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="task-controls">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">By category</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="study">Study</option>
          </select>
          <select 
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">By priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
        </div>

        <div className="todo-tasks">
          {filteredTasks.map((task) => {
            const taskId = task.data?.id ?? task.id;
            if (typeof taskId !== 'number') return null;
            
            return (
              <div 
                key={taskId} 
                className={`task-card ${isTaskUrgent(task) ? 'urgent' : ''}`}
              >
                <div className="task-card-header">
                  <h3 className="task-title">
                    {task.data?.attributes?.title ?? task.title}
                    {isTaskUrgent(task) && (
                      <FaExclamationTriangle className="urgent-icon" title="Due date approaching!" />
                    )}
                  </h3>
                  <div className="task-actions">
                    <button 
                      className="icon-button"
                      onClick={() => handleStatusToggle(task)}
                    >
                      <FaCheck className={`status-icon ${task.status === 'completed' ? 'completed' : ''}`} />
                    </button>
                    <button 
                      className="icon-button"
                      onClick={() => handleEditClick(task)}
                    >
                      <FaEdit className="edit-icon" />
                    </button>
                    <button 
                      className="icon-button"
                      onClick={() => handleDeleteTask(taskId)}
                    >
                      <FaTrash className="delete-icon" />
                    </button>
                  </div>
                </div>
                <p className="task-description">
                  {task.data?.attributes?.description ?? task.description ?? 'No description provided'}
                </p>
                <div className="task-dates">
                  <div className="date-row">
                    <span className="date-label">Start date:</span>
                    <span className="date-value">
                      {formatDate(task.data?.attributes?.startDate ?? task.startDate)}
                    </span>
                  </div>
                  <div className="date-row">
                    <span className="date-label">Due date:</span>
                    <span className="date-value">
                      {formatDate(task.data?.attributes?.endDate ?? task.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="todo-footer">
        <div className="tasks-count">
          <div className="count-box completed">
            <span className="count">{completedTasks}</span>
            <span className="label">COMPLETED TASKS</span>
          </div>
          <div className="count-box pending">
            <span className="count">{pendingTasks}</span>
            <span className="label">PENDING TASKS</span>
          </div>
        </div>
        <div className="tasks-created">
          <span className="created-label">TASKS CREATED</span>
          <span className="created-count">1,500</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          show={true}
          onHide={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default TaskList;