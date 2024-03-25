import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(request: Request) {
    const req = await request.json();

    try {
        let response;
        const data = await prisma.percentage.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (data) {
            response = await prisma.percentage.update({
                data: { value: parseFloat(req.value) },
                where: {
                    id: data.id
                }
            });
        } else {
            response = await prisma.percentage.create({
                data: { value: parseFloat(req.value) },
            });
        }

        return NextResponse.json({ message: "ok", response });
    } catch (error) {
        return NextResponse.json({ message: "error", error });
    }
}