/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { v2 as cloudinary } from "cloudinary";

/**
 * -----------------------------
 * Cloudinary Configuration
 * -----------------------------
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * -----------------------------
 * Upload Image Utility
 * -----------------------------
 * Processes a raw File object and uploads it to a specific Cloudinary folder.
 * @param file - The File object from FormData
 * @param folder - Target folder in Cloudinary (defaults to profiles)
 * @returns The secure URL of the uploaded image
 */
export async function uploadImage(
  file: File,
  folder: string = "bookworm/profiles",
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    })) as any;

    return uploadResponse.secure_url;
  } catch (error) {
    //console..error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to cloud storage");
  }
}
