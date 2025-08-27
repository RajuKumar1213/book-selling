import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order.models";

/**
 * DELETE /api/orders/[orderId]/delete
 * Delete an order from the database
 */
export async function DELETE(request, { params }) {
  try {
    const conn = await dbConnect();
    
    // Skip during build time
    if (conn.isConnectSkipped) {
      return NextResponse.json({
        success: true,
        message: "Build phase - operation skipped"
      });
    }

    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find the order first to check if it exists
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order can be deleted (optional business logic)
    // You might want to prevent deletion of delivered orders, etc.
    if (order.status === 'delivered') {
      return NextResponse.json(
        { error: "Cannot delete delivered orders" },
        { status: 400 }
      );
    }

    // Delete the order
    await Order.findOneAndDelete({ orderId });

    console.log(`🗑️ Order ${orderId} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deletedOrderId: orderId
    });

  } catch (error) {
    console.error("Error deleting order:", error);
    
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
