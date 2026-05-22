export type NotificationType = 'System' | 'Alert' | 'Message' | 'Task';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
