import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import prisma from "@/utils/db";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import MainLayout from "@/app/components/mainLayout";
import AddDeposito from "./addDeposito";

export default async function DashboardLayout({
  children,
  activeLink,
}: {
  children: ReactNode;
  activeLink: string;
}) {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { deposit: true },
  });
  const userDepositSubmit = await prisma.deposit.findMany({
    where: { user_id: session.user.name, status: "submit" },
  });
  const userDepositAccept = await prisma.deposit.findMany({
    where: { user_id: session.user.name, status: "accept" },
  });
  const totalAmount = userDepositAccept?.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );

  return (
    <MainLayout>
      <title>Depositor - Dashboard</title>
      <div className="md:px-8 card bg-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="md:text-3xl text-2xl font-medium mb-1 text-slate-300 capitalize">
                {userData?.username}
              </span>
              <span className="text-xs font-light -mb-1 md:text-base">
                Total Deposit
              </span>
              <span className="md:text-4xl text-2xl font-semibold text-slate-300">
                Rp. {totalAmount?.toLocaleString("id-ID")},-
              </span>
            </div>

            {userDepositSubmit.length === 0 && <AddDeposito />}
          </div>
        </div>
      </div>

      <div className="mt-6 border-b p-2 border-slate-500 flex gap-4">
        <Link
          href={"/"}
          className={`${activeLink === "submitted" && "text-info"}`}
        >
          Dikirim
        </Link>
        <Link
          href={"/dashboard/depositAccepted"}
          className={`${activeLink === "accepted" && "text-info"}`}
        >
          Diterima
        </Link>
        <Link
          href={"/dashboard/depositRejected"}
          className={`${activeLink === "rejected" && "text-info"}`}
        >
          Ditolak
        </Link>
      </div>

      <>{children}</>
    </MainLayout>
  );
}
