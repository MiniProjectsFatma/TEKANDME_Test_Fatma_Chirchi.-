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
  const isTaskOverdue = task.attributes.endDate ? isOverdue(task.attributes.endDate) : false;
  const statusColor = getTaskStatusColor(task.attributes.status, isTaskOverdue);
  const priorityColor = getPriorityColor(task.attributes.priority);

  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => task.id && onStatusChange(task.id, task.attributes.status === 'completed' ? 'pending' : 'completed')}
              className="btn btn-link p-0"
              style={{ color: statusColor }}
            >
              {task.attributes.status === 'completed' ? <BsCheckCircle size={20} /> : <BsCircle size={20} />}
            </button>
            <div>
              <h5 className="mb-1" style={{ 
                textDecoration: task.attributes.status === 'completed' ? 'line-through' : 'none',
                color: task.attributes.status === 'completed' ? '#757575' : 'inherit'
              }}>
                {task.attributes.title}
              </h5>
              {task.attributes.description && (
                <p className="mb-2 text-muted small">{task.attributes.description}</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <div className="d-flex gap-2 mb-1">
              <span className="badge" style={{ backgroundColor: statusColor, color: 'white' }}>
                {task.attributes.status}
              </span>
              <span className="badge" style={{ backgroundColor: priorityColor, color: 'white' }}>
                {task.attributes.priority}
              </span>
            </div>
            <div className="text-muted small">
              {task.attributes.startDate && task.attributes.endDate && (
                <>
                  {formatDate(task.attributes.startDate)} - {formatDate(task.attributes.endDate)}
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
