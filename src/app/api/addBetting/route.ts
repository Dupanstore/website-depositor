import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const response = await prisma.betting.create({
      data: {
        nominal: data.nominal,
        time: data.time,
        user: { connect: { id: data.session } },
      },
      include: { user: true },
    });
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
