import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(request: Request) {
    const req = await request.json();

    try {
        let response;
        const data = await prisma.durability.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (data) {
            response = await prisma.durability.update({
                data: { bang: req.value },
                where: {
                    id: data.id
                }
            });
        } else {
            response = await prisma.durability.create({
                data: { bang: req.value },
            });
        }

        return NextResponse.json({ message: "ok", response });
    } catch (error) {
        return NextResponse.json({ message: "error", error });
    }
}