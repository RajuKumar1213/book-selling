/**
 * Server-side order utility functions
 * These functions can only be used in API routes as they require database access
 */
import Order from '@/models/Order.models';

/**
 * Generate unique order ID with retry mechanism
 * Format: CWO + YYYYMMDD + 3-digit sequence number
 * Example: CWO20250609001
 */
export async function generateOrderId() {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const datePrefix = `${year}${month}${day}`;
      
      // Get today's orders to find the next available sequence number
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      // Get all orders for today and extract their sequence numbers
      const todayOrders = await Order.find({
        orderDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }, 'orderId').lean();
      
      // Extract sequence numbers from existing order IDs
      const existingSequences = todayOrders
        .map(order => {
          const match = order.orderId.match(/CWO\d{8}(\d{3})$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(seq => seq > 0)
        .sort((a, b) => a - b);
      
      // Find the next available sequence number
      let sequenceNumber = 1;
      for (const seq of existingSequences) {
        if (seq === sequenceNumber) {
          sequenceNumber++;
        } else {
          break;
        }
      }
      
      const orderId = `CWO${datePrefix}${String(sequenceNumber).padStart(3, '0')}`;
      
      // Double-check that this ID doesn't exist (race condition protection)
      const existingOrder = await Order.findOne({ orderId });
      if (!existingOrder) {
        console.log(`🆔 Generated unique order ID: ${orderId} (attempt ${attempt + 1})`);
        return orderId;
      }
      
      console.log(`⚠️ Order ID ${orderId} already exists, retrying... (attempt ${attempt + 1})`);
      attempt++;
      
      // Small delay to reduce race conditions
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
    } catch (error) {
      console.error(`Error generating order ID (attempt ${attempt + 1}):`, error);
      attempt++;
      
      if (attempt >= maxRetries) {
        console.error('Max retries exceeded, falling back to timestamp-based ID');
        // Fallback to timestamp-based ID with random suffix
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `CWO${timestamp}${random}`;
      }
    }
  }
}

/**
 * Calculate order statistics (server-side with database access)
 */
export function calculateOrderStats(orders) {
  const stats = {
    total: orders.length,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    outForDelivery: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  };

  orders.forEach(order => {
    stats[order.status]++;
    if (order.status !== 'cancelled') {
      stats.totalRevenue += order.totalAmount;
    }
  });

  stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;

  return stats;
}
