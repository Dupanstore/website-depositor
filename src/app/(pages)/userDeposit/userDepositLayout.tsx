import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import prisma from "@/utils/db";

export default async function UserDepositLayout({
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
  const roleUser = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  if (roleUser?.role !== "admin") {
    redirect("/");
  }

  return (
    <MainLayout>
      <title>HeGame - User Deposit</title>
      <div className="flex gap-4 border-b pb-2">
        <Link
          href={"/userDeposit"}
          className={`${activeLink === "" && "text-info font-medium"}`}
        >
          Pending
        </Link>
        <Link
          href={"/userDeposit/accept"}
          className={`${activeLink === "accept" && "text-info font-medium"}`}
        >
          Accept
        </Link>
        <Link
          href={"/userDeposit/reject"}
          className={`${activeLink === "reject" && "text-info font-medium"}`}
        >
          Reject
        </Link>
      </div>

      {children}
    </MainLayout>
  );
}
