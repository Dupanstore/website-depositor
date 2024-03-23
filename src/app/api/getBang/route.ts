import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { unstable_noStore } from "next/cache";

export async function GET(request: Request) {
    unstable_noStore();
    try {
        const data = await prisma.durability.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json({ message: "ok", response: data });
    } catch (error) {
        return NextResponse.json({ message: "error", error });
    }
}