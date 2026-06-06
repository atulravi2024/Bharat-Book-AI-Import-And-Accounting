import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from './NotificationData';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  markAllAsUnread: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'> & { createdAt?: string }) => void;
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

  const markAsUnread = (id: string) => {
    persistNotifications(
      notifications.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
  };

  const markAllAsRead = () => {
    persistNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAllAsUnread = () => {
    persistNotifications(notifications.map(n => ({ ...n, isRead: false })));
  };

  const removeNotification = (id: string) => {
    persistNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    persistNotifications([]);
  };

  const playAudioFeedback = (type: string) => {
    try {
      const savedGates = localStorage.getItem('bharat_book_admin_feature_gates');
      if (!savedGates) return;
      const gates = JSON.parse(savedGates);
      if (!gates.audioFeedback) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Soft melodic chime sequence on successful events
      if (type === 'Alert' || type === 'System' || type === 'Success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.type = 'sine';
        osc2.type = 'triangle';

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        // Ascending harmonic triad C5 -> E5 -> G5 -> C6
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5

        osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.18); // C6

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      } else {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.type = 'sine';

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.frequency.setValueAtTime(659.25, ctx.currentTime); 
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); 

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("Audio Context playback ignored", e);
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'> & { createdAt?: string }) => {
    const newNotification: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: notif.createdAt || new Date().toISOString(),
    };
    persistNotifications([newNotification, ...notifications]);
    playAudioFeedback(notif.type || 'Alert');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAsUnread,
      markAllAsRead,
      markAllAsUnread,
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
