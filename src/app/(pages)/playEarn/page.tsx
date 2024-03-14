import prisma from "@/utils/db";
import MainLayout from "@/app/components/mainLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { formatDate } from "@/utils/formatDate";
import Gacha from "./gacha";
import { VscError } from "react-icons/vsc";
import Link from "next/link";

export default async function WebInfo() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: {
      deposit: { where: { status: "accept" } },
      withdraw: { where: { status: "accept" } },
    },
  });
  const betting = await prisma.betting.findMany({
    where: { user_id: session.user.name },
    orderBy: [{ createdAt: "desc" }],
  });
  const bettingWin = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "win" },
  });

  const totalBetting = bettingWin.reduce(
    (total, betting) => total + betting.nominal,
    0
  );
  const userDeposit = user?.deposit.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );
  const userWithdraw = user?.withdraw.reduce(
    (total, withdraw) => total + withdraw.nominal,
    0
  );

  const totalCashout = totalBetting - userWithdraw!;
  const maxWin = `${user?.maxWin}000`;

  function speedLimit() {
    if (totalCashout < 10000) {
      return 1;
    } else if (totalCashout >= 10000 && totalCashout < 50000) {
      return 5;
    } else if (totalCashout >= 50000 && totalCashout < 100000) {
      return 10;
    } else if (totalCashout >= 100000 && totalCashout < 300000) {
      return 30;
    } else if (totalCashout >= 300000 && totalCashout < 500000) {
      return 50;
    } else if (totalCashout >= 500000 && totalCashout < 1000000) {
      return 100;
    } else if (totalCashout >= 1000000 && totalCashout < 3000000) {
      return 300;
    } else if (totalCashout >= 3000000 && totalCashout < 5000000) {
      return 500;
    } else if (totalCashout >= 5000000 && totalCashout < 10000000) {
      return 1000;
    } else if (totalCashout >= 10000000 && totalCashout < 30000000) {
      return 3000;
    } else if (totalCashout >= 30000000 && totalCashout < 50000000) {
      return 5000;
    } else if (totalCashout >= 50000000 && totalCashout < 100000000) {
      return 10000;
    }
  }
  const speed = speedLimit();

  if (userDeposit === 0) {
    return (
      <div className="flex items-center justify-center w-screen h-screen p-4">
        <title>No Deposit Yet</title>

        <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
          <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
            <VscError size={100} className="text-error" />
            <h1 className="text-4xl font-semibold">No Deposit Yet</h1>
            <p className="py-4 text-center">
              Anda Belum Deposit atau Deposit anda belum di konfirmasi oleh
              admin{" "}
              <Link
                className="link underline font-semibold text-sky-500"
                href={"/"}
              >
                Silahkan Deposit Terlebih dahulu.
              </Link>
            </p>
            <Link href={"/"} className="btn btn-primary text-white text-lg">
              OK
            </Link>
          </div>
        </div>
      </div>
    );
  } else if (totalCashout.toString() >= maxWin) {
    return (
      <div className="flex items-center justify-center w-screen h-screen p-4">
        <title>Winning Limit</title>

        <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
          <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
            <VscError size={100} className="text-error" />
            <h1 className="text-4xl font-semibold">Winning Limit</h1>
            <p className="py-4 text-center">
              Batas kemenangan anda telah tercapai{" "}
              <Link
                className="link underline font-semibold text-sky-500"
                href={"/"}
              >
                Silahkan Deposit Terlebih dahulu.
              </Link>
            </p>
            <Link href={"/"} className="btn btn-primary text-white text-lg">
              OK
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <MainLayout>
        <title>Riddles - Play Earn</title>
        <Gacha
          session={session.user.name}
          totalBetting={totalCashout}
          speed={speed!}
        />
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
                      doc.status === "win" ? "text-success" : "text-error"
                    }`}
                  >
                    {doc.status === "win" ? "Menang" : "Kalah"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainLayout>
    );
  }
}
