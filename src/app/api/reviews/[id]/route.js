import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review.models';
import Product from '@/models/Product.models';
import mongoose from 'mongoose';

// GET - Get review by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await Review.findById(id).lean();

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...review,
        _id: review._id.toString(),
        productId: review.productId.toString(),
        userId: review.userId?.toString(),
        orderId: review.orderId?.toString()
      }
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

// PATCH - Update review
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the current review
    const currentReview = await Review.findById(id);
    if (!currentReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    // If rating was changed, update product stats
    if ('rating' in body || 'isApproved' in body) {
      await updateProductRatingStats(currentReview.productId);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedReview.toObject(),
        _id: updatedReview._id.toString(),
        productId: updatedReview.productId.toString(),
        userId: updatedReview.userId?.toString(),
        orderId: updatedReview.orderId?.toString()
      },
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete review
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update product rating stats after deletion
    await updateProductRatingStats(review.productId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

// Helper function to update product rating stats
async function updateProductRatingStats(productId) {
  try {
    const stats = await Review.aggregate([
      { 
        $match: { 
          productId: new mongoose.Types.ObjectId(productId),
          isApproved: true 
        } 
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(
        productId,
        {
          rating: Number(stats[0].averageRating.toFixed(1)),
          reviewCount: stats[0].totalReviews
        }
      );
    } else {
      // No reviews left, reset to 0
      await Product.findByIdAndUpdate(
        productId,
        {
          rating: 0,
          reviewCount: 0
        }
      );
    }
  } catch (error) {
    console.error('Error updating product rating stats:', error);
  }
}
