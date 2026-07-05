import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { auth } from "@/lib/auth";

// Folders the client is allowed to upload into. Keeping this as an allow-list
// (rather than accepting an arbitrary path from the client) prevents a caller
// from writing outside the intended media namespaces.
const ALLOWED_FOLDERS = new Set(["teachers", "courses", "blog", "site"]);

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Upload attempted without BLOB_READ_WRITE_TOKEN configured.");
    return NextResponse.json(
      { error: "Image uploads are not configured yet. Add BLOB_READ_WRITE_TOKEN in your environment variables." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder = typeof folderRaw === "string" && ALLOWED_FOLDERS.has(folderRaw) ? folderRaw : "site";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file was provided." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a JPG, PNG, WEBP, or AVIF image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Image is too large. Maximum size is 5MB." }, { status: 400 });
    }

    const extension = file.name.split(".").pop() || "jpg";
    const pathname = `${folder}/${crypto.randomUUID()}.${extension}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error("Admin image upload error:", error);
    return NextResponse.json({ error: "Something went wrong while uploading the image." }, { status: 500 });
  }
}
