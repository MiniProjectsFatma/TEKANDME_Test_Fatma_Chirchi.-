import { useEffect, useCallback } from 'react';
import { Task } from '@/types/Task';
import { notificationService } from '@/services/notificationService';

export const useNotifications = (tasks: Task[]) => {
  const checkAndNotify = useCallback(() => {
    if (!tasks || !Array.isArray(tasks)) return;

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    tasks.forEach(task => {
      // Skip if task or attributes are undefined
      if (!task?.attributes) return;

      // Skip completed tasks
      if (task.attributes?.status === 'completed') return;

      const endDate = task.attributes?.endDate ? new Date(task.attributes.endDate) : null;
      if (!endDate) return;

      // Check for tasks due within 24 hours
      if (endDate > now && endDate <= twentyFourHoursFromNow) {
        notificationService.notifyTaskDue(task);
      }

      // Check for overdue tasks
      if (endDate < now) {
        notificationService.notifyTaskOverdue(task);
      }
    });
  }, [tasks]);

  useEffect(() => {
    // Request notification permission when the hook is first used
    notificationService.requestPermission();
  }, []);

  useEffect(() => {
    // Check for due and overdue tasks every 15 minutes
    const interval = setInterval(checkAndNotify, 15 * 60 * 1000);
    
    // Initial check
    checkAndNotify();

    return () => clearInterval(interval);
  }, [checkAndNotify]);

  return {
    notifyTaskUpdate: notificationService.notifyTaskUpdate,
    checkAndNotify 
  };
};
