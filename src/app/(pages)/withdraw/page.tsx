import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddWithdraw from "./addWithdraw";
import prisma from "@/utils/db";
import UpdateStatusWithdraw from "./updateStatus";
import { formatDate } from "@/utils/formatDate";

export default async function Withdraw() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const withdrawPending = await prisma.withdraw.findMany({
    where: { user_id: session.user.name, status: "pending" },
  });
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { withdraw: true },
  });
  const allUserWithdraw = await prisma.withdraw.findMany();
  const sortedWithdraws = allUserWithdraw.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <MainLayout>
      <title>HeGame - Withdraw</title>
      {withdrawPending.length === 0 && <AddWithdraw session={session} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {userData?.role === "admin"
        ? sortedWithdraws.map((doc) => (
              <div
                key={doc.id}
                className={`card shadow-lg ${
                  doc.status === "pending"
                    ? "bg-info"
                    : doc.status === "accept"
                    ? "bg-success"
                    : doc.status === "reject"
                    ? "bg-error"
                    : ""
                }`}
              >
                <div className="card-body text-white flex flex-row justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">
                      {formatDate(doc.createdAt.toISOString())}
                    </span>
                    <span className="font-medium">
                      Username : {getUserWithdraw(doc.user_id)}
                    </span>
                    <span className="font-semibold text-xl">
                      Rp {doc.nominal.toLocaleString("id-ID")},-
                    </span>
                    <span className="text-sm font-medium">
                      Nama : {doc.name}
                    </span>
                    <span className="text-sm font-medium">
                      Nomor : {doc.no_rekening}
                    </span>
                    <span className="text-sm font-medium uppercase">
                      {doc.bank}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className="font-semibold capitalize">
                      {doc.status}
                    </span>
                    {userData.role === "admin" && doc.status === "pending" && (
                      <div className="text-slate-700">
                        <UpdateStatusWithdraw id={doc.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          : userData?.withdraw.map((doc) => (
              <div
                key={doc.id}
                className={`card shadow-lg ${
                  doc.status === "pending"
                    ? "bg-info"
                    : doc.status === "accept"
                    ? "bg-success"
                    : doc.status === "reject"
                    ? "bg-error"
                    : ""
                }`}
              >
                <div className="card-body text-white flex flex-row justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">
                      {formatDate(doc.createdAt.toISOString())}
                    </span>
                    <span className="font-semibold text-xl">
                      Rp {doc.nominal.toLocaleString("id-ID")},-
                    </span>
                    <span className="text-sm font-medium">
                      Nama : {doc.name}
                    </span>
                    <span className="text-sm font-medium">
                      Nomor : {doc.no_rekening}
                    </span>
                    <span className="text-sm font-medium uppercase">
                      {doc.bank}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className="font-semibold capitalize">
                      {doc.status}
                    </span>
                    {userData.role === "admin" && doc.status === "pending" && (
                      <div className="text-slate-700">
                        <UpdateStatusWithdraw id={doc.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </MainLayout>
  );
}

async function getUserWithdraw(id: number) {
  const data = await prisma.user.findUnique({ where: { id } });
  return <>{data?.username}</>;
}
