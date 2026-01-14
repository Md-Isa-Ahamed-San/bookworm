"use server";

import { v2 as cloudinary } from "cloudinary";
import { getSession } from "../server/better-auth/server";
import { uploadImage } from "../server/lib/cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Call your existing lib function
    // You can change the folder name here based on what you are uploading
    const imageUrl = await uploadImage(file, "bookworm/books");

    return {
      success: true,
      data: { url: imageUrl },
    };
  } catch (error) {
    // //console..error("Server Action Upload Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

export async function deleteImage(publicId: string) {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    // //console..error("Error deleting image:", error)
    return { success: false, error: "Failed to delete image" };
  }
}
