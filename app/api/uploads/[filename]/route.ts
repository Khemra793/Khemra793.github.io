import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(
    process.env.SHOP_UPLOAD_DIR || path.join(process.cwd(), "public", "uploads"),
    safeFilename,
  );

  try {
    const file = await readFile(filePath);
    const contentType = contentTypes[path.extname(safeFilename).toLowerCase()] || "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
