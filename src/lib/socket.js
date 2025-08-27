import fs from 'fs';
import path from 'path';

// File path for storing notifications (for development)
const NOTIFICATIONS_FILE = path.join(process.cwd(), '.notifications.json');

// Initialize notifications storage
function getStoredNotifications() {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading notifications file:', error);
  }
  return [];
}

function saveNotifications(notifications) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
  } catch (error) {
    console.error('Error saving notifications file:', error);
  }
}

// Simple notification function for serverless environment
export function notifyNewOrder(orderData) {
  try {
    const notification = {
      orderId: orderData.orderId,
      customerName: orderData.customerInfo?.fullName,
      totalAmount: orderData.totalAmount,
      timestamp: new Date(),
      id: Date.now().toString()
    };

    // Get existing notifications
    const notifications = getStoredNotifications();
    
    // Add new notification
    notifications.push(notification);
    
    // Keep only last 50 notifications to prevent file bloat
    if (notifications.length > 50) {
      notifications.splice(0, notifications.length - 50);
    }

    // Save to file
    saveNotifications(notifications);

    console.log('📢 New order notification stored:', orderData.orderId);
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
}

// Get and clear pending notifications
export function getPendingNotifications() {
  try {
    const notifications = getStoredNotifications();
    
    // Clear the file after reading
    saveNotifications([]);
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}
