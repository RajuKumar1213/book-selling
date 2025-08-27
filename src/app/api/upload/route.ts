import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/helpers/uploadOnCloudinary";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;
    const folder = data.get("folder") as string;
    const type = data.get("type") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder and public_id based on type or folder parameter
    let uploadFolder = 'cakeswow-uploads';
    let publicIdPrefix = 'upload';
    
    if (folder) {
      uploadFolder = folder;
    } else if (type === 'review') {
      uploadFolder = 'cakeswow-reviews';
      publicIdPrefix = 'review';
    } else if (type === 'hero') {
      uploadFolder = 'cakeswow-hero-banners';
      publicIdPrefix = 'hero-banner';
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary({
      buffer,
      folder: uploadFolder,
      public_id: `${publicIdPrefix}-${Date.now()}`,
    });

    if (!uploadResult) {
      return NextResponse.json(
        { success: false, message: "Failed to upload image" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: (uploadResult as any).secure_url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
