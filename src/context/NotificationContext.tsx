import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from './NotificationData';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'System Update',
    message: 'A new system update has been installed successfully.',
    type: 'System',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'n2',
    title: 'New Voucher Created',
    message: 'User John Doe created a new Sales Voucher.',
    type: 'Alert',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: 'voucher-entry',
  },
  {
    id: 'n3',
    title: 'Stock Alert',
    message: 'Item "Premium Laptop" is running out of stock.',
    type: 'Task',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: 'item-report',
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bharat_book_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (err) {
        setNotifications(defaultNotifications);
      }
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem('bharat_book_notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  const persistNotifications = (items: AppNotification[]) => {
    setNotifications(items);
    localStorage.setItem('bharat_book_notifications', JSON.stringify(items));
  };

  const markAsRead = (id: string) => {
    persistNotifications(
      notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    persistNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    persistNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    persistNotifications([]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotification: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    persistNotifications([newNotification, ...notifications]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
