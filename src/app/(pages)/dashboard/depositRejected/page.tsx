import Link from "next/link";
import DashboardLayout from "../dashboardLayout";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth";
import { formatDate } from "@/utils/formatDate";

export default async function DashboardRejected() {
  const session: any = await getServerSession();
  const depositData = await prisma.deposit.findMany({
    where: { user_id: session.user.name, status: "reject" },
  });

  return (
    <DashboardLayout activeLink="rejected">
      <div className="overflow-x-auto mt-6 rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-error">
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
