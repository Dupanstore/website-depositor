import { NextResponse } from "next/server";

export function GET() {
  const serverTime = Date.now();
  return NextResponse.json({ time: serverTime });
}
