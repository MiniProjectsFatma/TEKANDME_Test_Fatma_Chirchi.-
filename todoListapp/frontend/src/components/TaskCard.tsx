import React from 'react';
import { Card } from 'react-bootstrap';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { Task } from '@/types/Task';
import { formatDate, isOverdue, getTaskStatusColor, getPriorityColor } from '@/utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: 'pending' | 'completed') => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const isTaskOverdue = task.endDate ? isOverdue(task.endDate) : false;
  const statusColor = getTaskStatusColor(task.status, isTaskOverdue);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => task.id && onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')}
              className="btn btn-link p-0"
              style={{ color: statusColor }}
            >
              {task.status === 'completed' ? <BsCheckCircle size={20} /> : <BsCircle size={20} />}
            </button>
            <div>
              <h5 className="mb-1" style={{ 
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                color: task.status === 'completed' ? '#757575' : 'inherit'
              }}>
                {task.title}
              </h5>
              {task.description && (
                <p className="mb-2 text-muted small">{task.description}</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex gap-2 mb-1">
              <span className="badge" style={{ backgroundColor: statusColor, color: 'white' }}>
                {task.status}
              </span>
              <span className="badge" style={{ backgroundColor: priorityColor, color: 'white' }}>
                {task.priority}
              </span>
            </div>
            <div className="text-muted small">
              {task.startDate && task.endDate && (
                <>
                  {formatDate(task.startDate)} - {formatDate(task.endDate)}
                </>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;
