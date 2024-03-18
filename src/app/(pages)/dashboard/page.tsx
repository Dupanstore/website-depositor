import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import MainLayout from "@/app/components/mainLayout";
import AddDeposito from "./addDeposito";
import ShowImage from "./showImage";
import { formatDate } from "@/utils/formatDate";

export default async function Dashboard() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { deposit: true },
  });
  const userDepositSubmit = await prisma.deposit.findMany({
    where: { user_id: session.user.name, status: "pending" },
  });
  const depositData = await prisma.deposit.findMany({
    where: { user_id: session.user.name },
  });

  const userWithdraw = await prisma.withdraw.findMany({
    where: { user_id: session.user.name, status: "accept" },
  });
  const betting = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "win" },
  });
  const totalWithdraw = userWithdraw.reduce(
    (total, withdraw) => total + withdraw.nominal,
    0
  );
  const totalBetting = betting.reduce(
    (total, betting) => total + betting.nominal,
    0
  );
  const resultSaldo = totalBetting - totalWithdraw;

  return (
    <MainLayout>
      <title>HeGame - Dashboard</title>
      <div className="md:px-8 card bg-info">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="md:text-3xl text-2xl font-medium mb-1 text-white capitalize">
                {userData?.username}
              </span>
              <span className="text-xs font-light -mb-1 md:text-base text-white">
                Total Earn
              </span>
              <span className="md:text-4xl text-2xl font-semibold text-white">
                Rp. {resultSaldo?.toLocaleString("id-ID")},-
              </span>
            </div>

            {userDepositSubmit.length === 0 && <AddDeposito />}
          </div>
        </div>
      </div>

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
