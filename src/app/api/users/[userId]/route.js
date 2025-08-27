import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User.models';
import Order from '@/models/Order.models';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { userId } = await params;
    
    const user = await User.findById(userId).select('-__v');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get detailed order statistics
    const orderStats = await Order.aggregate([
      { $match: { "customerInfo.mobileNumber": user.phoneNumber } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ "customerInfo.mobileNumber": user.phoneNumber })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId totalPrice status createdAt items');

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      firstOrderDate: null,
      averageOrderValue: 0
    };

    const userDetails = {
      id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      name: user.name || '',
      email: user.email || '',
      status: user.isVerified ? 'active' : 'inactive',
      joinedDate: user.createdAt,
      lastLogin: user.updatedAt,
      isVerified: user.isVerified,
      address: user.address || [],
      orderStatistics: {
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        averageOrderValue: stats.averageOrderValue || 0,
        firstOrderDate: stats.firstOrderDate,
        lastOrderDate: stats.lastOrderDate
      },
      recentOrders
    };

    return NextResponse.json({
      success: true,
      user: userDetails
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { userId } = await params;
    const body = await request.json();
    
    const { name, email, isVerified, action } = body;

    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    if (action === 'activate') {
      user.isVerified = true;
    } else if (action === 'deactivate') {
      user.isVerified = false;
    } else {
      // Regular update
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (isVerified !== undefined) user.isVerified = isVerified;
    }

    user.updatedAt = new Date();
    
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        status: user.isVerified ? 'active' : 'inactive'
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { userId } = await params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has any orders
    const orderCount = await Order.countDocuments({ "customerInfo.mobileNumber": user.phoneNumber });
    
    if (orderCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete user with existing orders. Consider deactivating instead.' 
        },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PATCH - Update user profile
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    
    const { userId } = await params;
    const body = await request.json();
    
    // Validate required fields
    const { name, email, phone } = body;
    
    if (!name && !email && !phone) {
      return NextResponse.json(
        { success: false, error: 'At least one field is required to update' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phone) updateData.phoneNumber = phone.trim();

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number format if provided
    if (phone && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email is already registered to another account' },
          { status: 400 }
        );
      }
    }

    // Check if phone number is already used by another user
    if (phone && phone !== existingUser.phoneNumber) {
      const phoneExists = await User.findOne({ 
        phoneNumber: phone.trim(),
        _id: { $ne: userId }
      });
      
      if (phoneExists) {
        return NextResponse.json(
          { success: false, error: 'Phone number is already registered to another account' },
          { status: 400 }
        );
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        createdAt: updatedUser.createdAt
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
