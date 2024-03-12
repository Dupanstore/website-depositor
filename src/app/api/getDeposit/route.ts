import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import { unstable_noStore } from "next/cache";

export async function GET() {
  unstable_noStore();
  try {
    const deposit = await prisma.deposit.findMany({
      where: { status: "accept" },
    });
    const betting = await prisma.betting.findMany();
    const withdraw = await prisma.withdraw.findMany({
      where: { status: "accept" },
    });
    const totalAmount = deposit.reduce(
      (total, deposit) => total + deposit.nominal_deposit,
      0
    );
    const totalBetting = betting.reduce(
      (total, betting) => total + betting.nominal,
      0
    );
    const totalWithdraw = withdraw.reduce(
      (total, withdraw) => total + withdraw.nominal,
      0
    );
    const result = totalAmount - totalBetting - totalWithdraw;
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
