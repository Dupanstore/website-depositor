import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const fileUpload = join(process.cwd(), "./public/assets");
    const result = `${fileUpload}/${data.img}`;
    const imageBuffer = fs.readFileSync(result);
    const dataUrl = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
    return NextResponse.json({ message: "ok", dataUrl });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
