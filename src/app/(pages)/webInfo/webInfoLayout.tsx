import prisma from "@/utils/db";
import DashboardLineChartData from "./chartData";
import MainLayout from "@/app/components/mainLayout";
import { ReactNode } from "react";
import Link from "next/link";

export default async function WebInfoLayout({
  children,
  activeLink,
}: {
  children: ReactNode;
  activeLink: string;
}) {
  const deposit = await prisma.deposit.findMany();
  const totalAmount = deposit.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );

  return (
    <MainLayout>
      <title>Depositor - Web Info</title>
      <DashboardLineChartData />

      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 max-w-2xl m-auto text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Total Deposit All User</span>
          <span className="text-base-300 bg-white rounded-lg w-full py-2">
            Rp {totalAmount.toLocaleString("id-ID")},-
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Speed</span>
          <span className="text-base-300 bg-white rounded-lg w-full py-2">
            Rp 1
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Waiting for the next round</span>
          <div className="flex flex-col items-center justify-center bg-slate-500 rounded-lg py-2 w-full text-white cursor-pointer">
            <span>Rp 50.000</span>
            <span className="text-3xl font-semibold">PLAY</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-b p-2 border-slate-500 flex gap-4">
        <Link
          href={"/webInfo"}
          className={`${activeLink === "submitted" && "text-info"}`}
        >
          Dikirim
        </Link>
        <Link
          href={"/webInfo/depositAccepted"}
          className={`${activeLink === "accepted" && "text-info"}`}
        >
          Diterima
        </Link>
        <Link
          href={"/webInfo/depositRejected"}
          className={`${activeLink === "rejected" && "text-info"}`}
        >
          Ditolak
        </Link>
      </div>

      <>{children}</>
    </MainLayout>
  );
}
