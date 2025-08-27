import { useEffect, useState, useCallback, useRef } from 'react';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(true);
  const callbacksRef = useRef([]);

  const joinAdmin = useCallback(() => {
    console.log('👨‍💼 Admin joined for notifications');
    // No automatic polling - notifications will be checked manually
  }, []);

  const checkNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (data.notifications && data.notifications.length > 0) {
        // Trigger all registered callbacks
        data.notifications.forEach(notification => {
          callbacksRef.current.forEach(callback => {
            try {
              callback(notification);
            } catch (error) {
              console.error('Notification callback error:', error);
            }
          });
        });
      }
    } catch (error) {
      console.error('Notification check error:', error);
    }
  }, []);

  const onNewOrder = useCallback((callback) => {
    // Add callback to the list
    callbacksRef.current.push(callback);
    
    // Return cleanup function
    return () => {
      callbacksRef.current = callbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const offNewOrder = useCallback((callback) => {
    callbacksRef.current = callbacksRef.current.filter(cb => cb !== callback);
  }, []);

  return { 
    isConnected, 
    joinAdmin, 
    onNewOrder, 
    offNewOrder,
    checkNotifications // Expose manual check function
  };
}
