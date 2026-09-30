import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const extensions: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please select an image file." }, { status: 400 });
    }

    if (!extensions[file.type] || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Images must be JPG, PNG, WEBP, or GIF and smaller than 5 MB." }, { status: 400 });
    }

    const directory = process.env.SHOP_UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });
    const filename = `${randomUUID()}${extensions[file.type]}`;
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

    const url = directory === path.join(process.cwd(), "public", "uploads")
      ? `/uploads/${filename}`
      : `/api/uploads/${filename}`;
    return NextResponse.json({ url, filename }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Image upload failed." }, { status: 400 });
  }
}
