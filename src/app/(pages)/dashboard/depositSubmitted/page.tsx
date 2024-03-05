import Link from "next/link";
import DashboardLayout from "../dashboardLayout";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { formatDate } from "@/utils/formatDate";
import { redirect } from "next/navigation";

export default async function DashboardSubmitted() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const depositData = await prisma.deposit.findMany({
    where: { user_id: session.user.name, status: "submit" },
  });

  async function getRecipientBankById(id: number) {
    const response = await prisma.rekening.findUnique({ where: { id } });
    return response;
  }

  return (
    <DashboardLayout activeLink="submitted">
      <div className="overflow-x-auto mt-6 rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-info">
              <th>No</th>
              <th>Tanggal</th>
              <th>Pengirim</th>
              <th>Penerima</th>
              <th>Nominal</th>
              <th>Bukti Transfer</th>
            </tr>
          </thead>

          <tbody>
            {depositData.map((doc, index) => (
              <tr className="bg-slate-800" key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(doc.createdAt.toISOString())}</td>
                <td>{doc.sender_bank}</td>
                <td>{doc.recipient_bank}</td>
                <td>{doc.nominal_deposit.toLocaleString("id-ID")}</td>
                <td>
                  <Link
                    className="link link-info"
                    href={`/assets/${doc.proof_transaction}`}
                    target="blank"
                  >
                    Show
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
