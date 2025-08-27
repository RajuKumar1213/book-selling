import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category.models";
import Product from "@/models/Product.models";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Try to find by MongoDB ObjectId first, then by slug
    let category;
    
    // Check if it's a valid MongoDB ObjectId (24 character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      category = await Category.findById(id).lean();
    } else {
      // Assume it's a slug
      category = await Category.findOne({ 
        slug: id,
        isActive: true 
      }).lean();
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    
    // Only allow updates by ID (not slug)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category ID for update"
        },
        { status: 400 }
      );
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully"
    });

  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Only allow deletion by ID (not slug)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category ID for deletion"
        },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found"
        },
        { status: 404 }
      );
    }

    // Check if any products are using this category
    const productsUsingCategory = await Product.countDocuments({
      $or: [
        { category: id },
        { categories: id }
      ]
    });

    if (productsUsingCategory > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category. It is being used by ${productsUsingCategory} product(s). Please remove the category from all products first.`
        },
        { status: 400 }
      );
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete category"
      },
      { status: 500 }
    );
  }
}
