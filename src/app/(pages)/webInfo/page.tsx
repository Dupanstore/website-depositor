import prisma from "@/utils/db";
import MainLayout from "@/app/components/mainLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { formatDate } from "@/utils/formatDate";
import ShowImage from "../dashboard/showImage";
import UpdateStatusUserDeposit from "./updateStatus";
import Gacha from "./gacha";

export default async function WebInfo() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const roleUser = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  const depositData = await prisma.deposit.findMany();

  return (
    <MainLayout>
      <title>Depositor - Web Info</title>
      <Gacha session={session.user.name} />
      <div className="overflow-x-auto mt-6 rounded-xl">
        <table className="table text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Pengirim</th>
              <th>Rekening Pengirim</th>
              <th>Bank Pengirim</th>
              <th>Penerima</th>
              <th>Rekening Penerima</th>
              <th>Bank Penerima</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>Bukti Transfer</th>
              {roleUser?.role === "admin" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {depositData.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDate(doc.createdAt.toISOString())}</td>
                <td>{doc.sender_name}</td>
                <td>{doc.sender_rekening}</td>
                <td className="uppercase">{doc.sender_bank}</td>
                <td>{doc.recipient_name}</td>
                <td>{doc.recipient_rekening}</td>
                <td className="uppercase">{doc.recipient_bank}</td>
                <td>{doc.nominal_deposit.toLocaleString("id-ID")}</td>
                <td
                  className={`badge capitalize text-xs text-white font-semibold my-2 ${
                    doc.status === "pending"
                      ? "badge-info"
                      : doc.status === "accept"
                      ? "badge-success"
                      : doc.status === "reject"
                      ? "badge-error"
                      : "badge-neutral"
                  }`}
                >
                  {doc.status}
                </td>
                <td>
                  <ShowImage path={doc.proof_transaction} />
                </td>
                {roleUser?.role === "admin" && doc.status === "pending" && (
                  <td className="flex items-center justify-center">
                    <UpdateStatusUserDeposit id={doc.id} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
