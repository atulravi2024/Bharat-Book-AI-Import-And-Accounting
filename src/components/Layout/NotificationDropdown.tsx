import React, { useRef, useEffect } from 'react';
import { NotificationsIcon } from '../icons/IconComponents';
import { useNotifications } from '../../context/NotificationContext';
import { MainView } from '../../app/types';
import { useLanguage } from '../../context/LanguageContext';

interface NotificationDropdownProps {
  onViewChange?: (view: MainView) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const { t } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link && onViewChange) {
      onViewChange(link as MainView);
    }
    setIsOpen(false);
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'System': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/30';
      case 'Alert': return 'text-red-500 bg-red-50 dark:bg-red-900/30';
      case 'Task': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/30';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-premium-slate-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-all font-sans"
      >
        <NotificationsIcon className="scale-100 sm:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-gray-800"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-96 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">{t("Notifications")}</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                >
                  {t("Mark all as read")}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-6rem)] sm:max-h-[60vh] custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t("No notifications yet.")}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 transition-colors relative group block w-full text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                    onClick={() => handleNotificationClick(notif.id, notif.link)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(notif.type)}`}>
                        <NotificationsIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm font-bold ${!notif.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} truncate`}>
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-2">
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                      title="Remove notification"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};
