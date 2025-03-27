import { Task } from '@/types/Task';

class NotificationService {
  private static instance: NotificationService | null = null;
  private permission: NotificationPermission = 'default';
  private notificationHistory: Set<string> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async init() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    this.permission = await Notification.requestPermission();
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  private getNotificationId(task: Task, type: 'due' | 'overdue' | 'update'): string {
    return `${task.id}-${type}-${new Date().toDateString()}`;
  }

  private hasNotificationBeenSent(notificationId: string): boolean {
    return this.notificationHistory.has(notificationId);
  }

  private markNotificationAsSent(notificationId: string): void {
    this.notificationHistory.add(notificationId);
  }

  private showNotification(title: string, options: NotificationOptions): void {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (this.permission === 'granted') {
      new Notification(title, options);
    }
  }

  public notifyTaskDue(task: Task): void {
    if (!task?.attributes) return;

    const notificationId = this.getNotificationId(task, 'due');
    if (this.hasNotificationBeenSent(notificationId)) return;

    const title = 'Task Due Soon';
    const options: NotificationOptions = {
      body: `The task "${task.attributes.title}" is due soon.`,
      icon: '/favicon.ico',
      tag: notificationId,
    };

    this.showNotification(title, options);
    this.markNotificationAsSent(notificationId);
  }

  public notifyTaskOverdue(task: Task): void {
    if (!task?.attributes) return;

    const notificationId = this.getNotificationId(task, 'overdue');
    if (this.hasNotificationBeenSent(notificationId)) return;

    const title = 'Task Overdue';
    const options: NotificationOptions = {
      body: `The task "${task.attributes.title}" is overdue!`,
      icon: '/favicon.ico',
      tag: notificationId,
    };

    this.showNotification(title, options);
    this.markNotificationAsSent(notificationId);
  }

  public notifyTaskUpdate(task: Task, action: 'created' | 'updated' | 'deleted'): void {
    if (!task?.attributes && action !== 'deleted') return;

    const notificationId = this.getNotificationId(task, 'update');
    if (this.hasNotificationBeenSent(notificationId)) return;

    const title = 'Task Update';
    const options: NotificationOptions = {
      body: `Task "${task.attributes?.title || 'Unknown'}" has been ${action}.`,
      icon: '/favicon.ico',
      tag: notificationId,
    };

    this.showNotification(title, options);
    this.markNotificationAsSent(notificationId);
  }
}

export const notificationService = NotificationService.getInstance();
