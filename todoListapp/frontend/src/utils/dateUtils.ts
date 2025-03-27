import { format, parseISO, isAfter } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    return format(parseISO(date), 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
};

export const isOverdue = (endDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = parseISO(endDate);
  return isAfter(today, end);
};

export const getTaskStatusColor = (status: string, isOverdue: boolean): string => {
  if (isOverdue) return '#FF4B4B';
  return status === 'completed' ? '#4CAF50' : '#FFA726';
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#FF4B4B';
    case 'medium':
      return '#FFA726';
    case 'low':
      return '#4CAF50';
    default:
      return '#757575';
  }
};
