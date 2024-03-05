import Navbar from "@/app/components/navbar";
import PageRouteSecure from "@/app/components/pageRouteSecure";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";
import prisma from "@/utils/db";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  activeLink,
}: {
  children: ReactNode;
  activeLink: string;
}) {
  const session: any = await getServerSession();
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { deposit: true },
  });
  const totalAmount = userData?.deposit.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );

  return (
    <PageRouteSecure>
      <Navbar />
      <title>Deposito - Dashboard</title>
      <div className="p-4">
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

              <Link
                href={"/addNewDeposito"}
                className="text-green-500 hover:text-green-600 transition cursor-pointer text-5xl"
              >
                <FaPlusCircle />
              </Link>
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
      </div>
    </PageRouteSecure>
  );
}
