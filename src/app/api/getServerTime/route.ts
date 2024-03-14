import { unstable_noStore } from "next/cache";
import { NextResponse } from "next/server";

export function GET() {
  unstable_noStore();
  const serverTime = Date.now();
  return NextResponse.json({ time: serverTime });
}
