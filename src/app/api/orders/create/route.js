import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order.models";
import { generateOrderId } from "@/lib/serverOrderUtils";
import { uploadToCloudinary } from "@/helpers/uploadOnCloudinary";

/**
 * POST /api/orders/create
 * Create order in database with pending payment status
 */
export async function POST(request) {
  try {
    const conn = await dbConnect();
    
    // Skip during build time
    if (conn.isConnectSkipped) {
      return NextResponse.json({
        success: true,
        message: "Build phase - operation skipped"
      });
    }

    const orderData = await request.json();

    // Validate required fields
    const requiredFields = ["items", "customerInfo", "totalAmount"];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate customer info
    const { customerInfo } = orderData;
    const requiredCustomerFields = [
      "fullName",
      "mobileNumber",
      "deliveryDate",
      "timeSlot",
      "area",
      "fullAddress",
    ];
    for (const field of requiredCustomerFields) {
      if (!customerInfo[field]) {
        return NextResponse.json(
          { error: `Customer ${field} is required` },
          { status: 400 }
        );
      }
    } // Validate mobile number - clean and validate
    const cleanMobileNumber = customerInfo.mobileNumber
      .replace(/\s+/g, "")
      .replace(/^\+91/, "");
    if (!/^[6-9]\d{9}$/.test(cleanMobileNumber)) {
      return NextResponse.json(
        {
          error: `Invalid mobile number format. Expected 10 digits starting with 6-9. Received: ${customerInfo.mobileNumber}`,
        },
        { status: 400 }
      );
    }

    // Use cleaned mobile number
    customerInfo.mobileNumber = cleanMobileNumber;

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    // Generate unique order ID with retry mechanism
    let orderId;
    let savedOrder;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        orderId = await generateOrderId();
        console.log(`🆔 Generated order ID: ${orderId} (attempt ${attempt})`);
        break; // Success, exit the ID generation loop
        
      } catch (idError) {
        console.error(`Order ID generation attempt ${attempt} failed:`, idError);
        
        if (attempt >= maxRetries) {
          throw new Error("Failed to generate unique order ID after multiple attempts");
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      }
    }    // Process items and handle photo cake image uploads
    console.log('🔍 Processing', orderData.items.length, 'items for photo cake customization...');
    console.log('🔐 Cloudinary config check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    });
    
    const processedItems = await Promise.all(
      orderData.items.map(async (item, index) => {
        
        // Photo cake items should already have imageUrl from checkout upload
        if (item.customization && item.customization.type === 'photo-cake') {
          console.log('📸 Processing photo cake item:', item.name);
          
          if (item.customization.imageUrl) {
            console.log('✅ Photo cake has uploaded image URL:', item.customization.imageUrl);
          } else {
            console.log('⚠️ Photo cake missing image URL - upload may have failed');
          }
          
          // Just save the item as-is since upload already happened in checkout
          return {
            ...item,
            customization: {
              type: item.customization.type,
              message: item.customization.message || '',
              imageUrl: item.customization.imageUrl || null
            }
          };
        }
        
        // Return item as-is if no photo cake customization
        console.log('📝 Item processed without customization');
        return item;
      })
    );

    console.log('🔄 Processed', processedItems.length, 'items for order', orderId);// Process add-ons if they exist
    let processedAddons = [];
    if (orderData.selectedAddOns && Array.isArray(orderData.selectedAddOns) && orderData.selectedAddOns.length > 0) {
      processedAddons = orderData.selectedAddOns.map(addon => ({
        addOnId: addon._id || addon.addOnId,
        name: addon.name,
        price: addon.price,
        quantity: orderData.addOnQuantities?.[addon._id] || 1,
        image: addon.image || "",
      }));      console.log('🎁 Processing addons:', processedAddons);
      console.log('🎁 Original addon count:', orderData.selectedAddOns?.length || 0);
    } else {
      console.log('🎁 No addons in order data');
    }

    // Create and save order with retry mechanism for duplicate key errors
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Create order in database with payment pending status
        const order = new Order({
          orderId,
          items: processedItems, // Use processed items with uploaded images
          addons: processedAddons,
          customerInfo: orderData.customerInfo,
          totalAmount: orderData.totalAmount,
          subtotal: orderData.subtotal || orderData.totalAmount,
          deliveryCharge: orderData.deliveryCharge || 0,
          onlineDiscount: 0, // No discount applied
          status: "pending",
          paymentStatus: "pending",
          paymentMethod: orderData.paymentMethod || "online", // Default to online, will be updated later
          orderDate: new Date(),
          estimatedDeliveryDate: new Date(orderData.customerInfo.deliveryDate),
          timeSlot: orderData.customerInfo.timeSlot,
          notes: orderData.notes || "",
        });

        // Save order to database
        savedOrder = await order.save();
        console.log(`💾 Order saved successfully: ${savedOrder.orderId} (attempt ${attempt})`);
        break; // Success, exit the retry loop
        
      } catch (saveError) {
        console.error(`Order save attempt ${attempt} failed:`, saveError);
        
        // If it's a duplicate key error and we haven't exceeded max retries, regenerate ID and try again
        if (saveError.code === 11000 && attempt < maxRetries) {
          console.log(`🔄 Duplicate order ID detected, generating new ID and retrying... (attempt ${attempt + 1})`);
          orderId = await generateOrderId(); // Generate new ID
          await new Promise(resolve => setTimeout(resolve, Math.random() * 200)); // Small delay
          continue;
        }
        
        // If it's not a duplicate key error or we've exceeded retries, throw the error
        throw saveError;
      }
    }

    if (!savedOrder) {
      throw new Error("Failed to create order after multiple attempts");
    }
    console.log('💾 Saved order addons:', savedOrder.addons);

    // Return success response with order details
    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",        order: {
          id: savedOrder._id.toString(),
          orderId: savedOrder.orderId,
          totalAmount: savedOrder.totalAmount,
          status: savedOrder.status,
          paymentStatus: savedOrder.paymentStatus,
          customerInfo: savedOrder.customerInfo,
          estimatedDeliveryDate: savedOrder.estimatedDeliveryDate,
          timeSlot: savedOrder.timeSlot,          items: savedOrder.items, // Now contains permanent Cloudinary URLs
          addons: savedOrder.addons,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Order ID conflict", 
          details: "Failed to generate unique order ID. Please try again." 
        },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid order data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
