import prisma from "@/utils/db";
import MainLayout from "@/app/components/mainLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { formatDate } from "@/utils/formatDate";
import Gacha from "./gacha";

export default async function WebInfo() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const betting = await prisma.betting.findMany({
    where: { user_id: session.user.name },
  });
  const bettingWin = await prisma.betting.findMany({
    where: { user_id: session.user.name, nominal: { not: 0 } },
  });
  const totalBetting = bettingWin.reduce(
    (total, betting) => total + betting.nominal,
    0
  );

  return (
    <MainLayout>
      <title>Riddles - Play Earn</title>
      <Gacha session={session.user.name} totalBetting={totalBetting} />
      <div className="overflow-x-auto mt-6 rounded-xl">
        <table className="table text-center">
          <thead className="bg-info text-white">
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Nominal</th>
              <th>Hasil</th>
            </tr>
          </thead>

          <tbody>
            {betting.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(doc.createdAt.toISOString())}</td>
                <td>{doc.time} Detik</td>
                <td>Rp {doc.nominal.toLocaleString("id-ID")},-</td>
                <td
                  className={`font-semibold ${
                    doc.nominal === 0 ? "text-error" : "text-success"
                  }`}
                >
                  {doc.nominal === 0 ? "Kalah" : "Menang"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
