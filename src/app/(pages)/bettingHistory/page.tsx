import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { formatDate } from "@/utils/formatDate";

export default async function BettingHistory() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const betting = await prisma.betting.findMany({
    where: { user_id: session.user.name },
  });

  return (
    <MainLayout>
      <title>Depositor - Riwayat Taruhan</title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {betting.map((doc) => (
          <div
            key={doc.id}
            className={`card shadow-lg ${
              doc.nominal === 0 ? "bg-error" : "bg-success"
            }`}
          >
            <div className="card-body text-white flex flex-row justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  {formatDate(doc.createdAt.toISOString())}
                </span>
                <span className="font-semibold text-xl">
                  Rp {doc.nominal},-
                </span>
                <span className="text-sm font-medium">{doc.time} Detik</span>
              </div>
              <span className="font-semibold">{`${
                doc.nominal === 0 ? "Kalah" : "Menang"
              }`}</span>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
