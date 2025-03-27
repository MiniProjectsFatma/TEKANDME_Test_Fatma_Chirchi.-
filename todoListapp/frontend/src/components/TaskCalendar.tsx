'use client';

import React, { useState } from 'react';
import { Calendar, CalendarProps } from 'react-calendar';
type Value = CalendarProps['value'];
import { format, parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { Task } from '@/types/Task';
import { Card, Badge, ListGroup } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';

interface TaskCalendarProps {
  tasks: Task[];
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Explicitly type the onChange handler to match Calendar component
  const handleDateChange = (value: Value, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Handle different possible input types
    if (value === null) return;

    let newDate: Date;
    if (Array.isArray(value)) {
      // If it's an array, take the first date
      const firstDate = value[0];
      newDate = firstDate instanceof Date ? firstDate : new Date(firstDate || Date.now());
    } else {
      // If it's a single date or date-like value
      newDate = value instanceof Date ? value : new Date(value || Date.now());
    }

    setSelectedDate(newDate);
  };

  const getTasksForDate = (date: Date) => {
    if (!Array.isArray(tasks)) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task?.attributes?.startDate) return false;

      try {
        const startDate = new Date(task.attributes.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = task.attributes.endDate 
          ? new Date(task.attributes.endDate)
          : startDate;
        endDate.setHours(0, 0, 0, 0);

        return (
          (isAfter(targetDate, startDate) || isEqual(targetDate, startDate)) &&
          (isBefore(targetDate, endDate) || isEqual(targetDate, endDate))
        );
      } catch (error) {
        console.error('Error parsing date:', error);
        return false;
      }
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length === 0) return null;

    const highPriorityCount = tasksForDate.filter(
      task => task?.attributes?.priority === 'high'
    ).length;

    return (
      <div className="task-indicator">
        <span className="task-count">{tasksForDate.length}</span>
        {highPriorityCount > 0 && (
          <span className="priority-dot" />
        )}
      </div>
    );
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';

    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length === 0) return '';

    const hasHighPriority = tasksForDate.some(
      task => task?.attributes?.priority === 'high'
    );
    const hasOverdue = tasksForDate.some(task => {
      if (task?.attributes?.status === 'completed') return false;
      const endDate = task.attributes.endDate 
        ? new Date(task.attributes.endDate)
        : new Date(task.attributes.startDate);
      endDate.setHours(0, 0, 0, 0);
      return isAfter(new Date(), endDate);
    });

    return `has-tasks ${hasHighPriority ? 'has-high-priority' : ''} ${hasOverdue ? 'has-overdue' : ''}`;
  };

  const selectedTasks = getTasksForDate(selectedDate);

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

  const getStatusBadgeVariant = (status: string) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  return (
    <Card className="calendar-card">
      <Card.Body>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="mb-3"
        />

        <div className="selected-date mt-4">
          <h5>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h5>
          {selectedTasks.length === 0 ? (
            <p className="text-muted">No tasks scheduled for this date.</p>
          ) : (
            <ListGroup variant="flush">
              {selectedTasks.map((task, index) => (
                <ListGroup.Item
                  key={task.id || index}
                  className={`d-flex justify-content-between align-items-center ${
                    task?.attributes?.status === 'completed' ? 'text-muted' : ''
                  }`}
                >
                  <div>
                    <div className="fw-medium">{task?.attributes?.title}</div>
                    {task?.attributes?.description && (
                      <small className="text-muted">{task.attributes.description}</small>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Badge bg={getPriorityBadgeVariant(task?.attributes?.priority || 'medium')}>
                      {task?.attributes?.priority || 'medium'}
                    </Badge>
                    <Badge bg={getStatusBadgeVariant(task?.attributes?.status || 'pending')}>
                      {task?.attributes?.status || 'pending'}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <style jsx global>{`
          .calendar-card .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
          }

          .task-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
          }

          .priority-dot {
            width: 6px;
            height: 6px;
            background-color: #dc3545;
            border-radius: 50%;
            margin-top: 2px;
          }

          .has-tasks {
            background-color: #e9ecef;
          }

          .has-high-priority {
            font-weight: bold;
          }

          .has-overdue {
            color: #dc3545;
          }
        `}</style>
      </Card.Body>
    </Card>
  );
};

export default TaskCalendar;