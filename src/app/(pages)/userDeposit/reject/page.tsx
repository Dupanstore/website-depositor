import prisma from "@/utils/db";
import { formatDate } from "@/utils/formatDate";
import UserDepositLayout from "../userDepositLayout";
import ShowImage from "../../dashboard/showImage";
import DeleteDeposit from "./delete";

export default async function UserDepositReject() {
  const depositData = await prisma.deposit.findMany({
    where: { status: "reject" },
  });

  return (
    <UserDepositLayout activeLink="reject">
      <div className="overflow-x-auto mt-6 rounded-xl">
        <table className="table text-center">
          <thead className="bg-error text-white">
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
              <th>Bukti Transfer</th>
              <th>Action</th>
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
                <td>
                  <ShowImage path={doc.proof_transaction} />
                </td>
                <td>
                  <DeleteDeposit doc={doc} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UserDepositLayout>
  );
}
