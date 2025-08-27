import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User.models';
import Order from '@/models/Order.models';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build search query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter logic - for now we'll use isVerified as a proxy for active/inactive
    // You can add more sophisticated status logic later
    if (status !== 'all') {
      if (status === 'active') {
        query.isVerified = true;
      } else if (status === 'inactive') {
        query.isVerified = false;
      }
      // Note: We don't have a 'banned' status in the current User model
      // You might want to add this field to the User schema
    }

    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const totalUsers = await User.countDocuments(query);

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Get order statistics for this user
          const orderStats = await Order.aggregate([
            { $match: { "customerInfo.mobileNumber": user.phoneNumber } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSpent: { $sum: '$totalPrice' },
                lastOrderDate: { $max: '$createdAt' }
              }
            }
          ]);

          const stats = orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null
          };

          return {
            id: user._id.toString(),
            phoneNumber: user.phoneNumber,
            name: user.name || '',
            email: user.email || '',
            status: user.isVerified ? 'active' : 'inactive',
            joinedDate: user.createdAt,
            lastLogin: user.updatedAt, // Using updatedAt as proxy for last activity
            totalOrders: stats.totalOrders,
            totalSpent: stats.totalSpent,
            orderCount: stats.totalOrders,
            lastOrderDate: stats.lastOrderDate,
            isVerified: user.isVerified,
            addressCount: user.address ? user.address.length : 0
          };
        } catch (error) {
          console.error('Error getting stats for user:', user._id, error);
          return {
            id: user._id.toString(),
            phoneNumber: user.phoneNumber,
            name: user.name || '',
            email: user.email || '',
            status: user.isVerified ? 'active' : 'inactive',
            joinedDate: user.createdAt,
            lastLogin: user.updatedAt,
            totalOrders: 0,
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: null,
            isVerified: user.isVerified,
            addressCount: user.address ? user.address.length : 0
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNextPage: page < Math.ceil(totalUsers / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
