import { getSession } from "../../../server/better-auth/server";
import { NextResponse, type NextRequest } from "next/server";
import { uploadImage } from "../../../server/lib/cloudinary";

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // If no session, only allow uploads to "signup" folders
    // if (!session && !folder.startsWith("register")) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Upload the image
    const imageUrl = await uploadImage(file, `bookworm/${folder}`);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
