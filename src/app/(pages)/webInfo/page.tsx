import { getServerSession } from "next-auth";
import WebInfoLayout from "./webInfoLayout";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import ShowImage from "../dashboard/showImage";
import UpdateStatusUserDeposit from "./updateStatus";

export default async function AllDepositSubmitted() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const roleUser = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  const depositData = await prisma.deposit.findMany({
    where: { status: "submit" },
  });

  return (
    <WebInfoLayout activeLink="submitted">
      <div className="overflow-x-auto mt-6 rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-info">
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
              {roleUser?.role === "admin" && <th>Action</th>}
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
                {roleUser?.role === "admin" && (
                  <td className="flex items-center justify-center">
                    <UpdateStatusUserDeposit id={doc.id} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WebInfoLayout>
  );
}
