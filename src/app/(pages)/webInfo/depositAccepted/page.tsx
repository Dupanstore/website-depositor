import { formatDate } from "@/utils/formatDate";
import WebInfoLayout from "../webInfoLayout";
import ShowImage from "../../dashboard/showImage";
import prisma from "@/utils/db";

export default async function AllDepositAccepted() {
  const depositData = await prisma.deposit.findMany({
    where: { status: "accept" },
  });

  return (
    <WebInfoLayout activeLink="accepted">
      <div className="overflow-x-auto mt-6 rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-success">
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
                  <ShowImage path={doc.proof_transaction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WebInfoLayout>
  );
}
