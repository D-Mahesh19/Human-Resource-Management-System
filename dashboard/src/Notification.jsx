import React, { useState, useEffect } from 'react';


export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8081/notifications/${userId}`);
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(notification => !notification.read).length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:8081/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(unreadCount - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-icon">
        {unreadCount > 0 && <span className="notification-dot"></span>}
        {/* <i className="fa fa-bell"></i> */}
      </div>
      <div className="notification-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notification.id)}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
