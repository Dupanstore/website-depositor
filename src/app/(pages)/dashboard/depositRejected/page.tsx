import DashboardLayout from "../dashboardLayout";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth";
import { formatDate } from "@/utils/formatDate";
import { redirect } from "next/navigation";
import ShowImage from "../showImage";

export default async function DashboardRejected() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
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
              <th>Rekening Pengirim</th>
              <th>Bank Pengirim</th>
              <th>Penerima</th>
              <th>Rekening Penerima</th>
              <th>Bank Penerima</th>
              <th>Nominal</th>
              <th>Bukti Transfer</th>
            </tr>
          </thead>

          <tbody>
            {depositData.map((doc, index) => (
              <tr className="bg-slate-800" key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(doc.createdAt.toISOString())}</td>
                <td>{doc.sender_name}</td>
                <td>{doc.sender_rekening}</td>
                <td className="uppercase">{doc.sender_bank}</td>
                <td>{doc.recipient_name}</td>
                <td>{doc.recipient_rekening}</td>
                <td className="uppercase">{doc.recipient_bank}</td>
                <td>{doc.nominal_deposit.toLocaleString("id-ID")}</td>
                <td>
                  <ShowImage path={doc.proof_transaction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
