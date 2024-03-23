import prisma from "@/utils/db";
import MainLayout from "@/app/components/mainLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Gacha from "./gacha";
import { VscError } from "react-icons/vsc";
import Link from "next/link";
import BettingHistory from "./history";
import GetUserById from "./getUserById";

interface UserRole {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  email: string;
  role: string;
  maxWin: number;
}

export default async function WebInfo() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const roleUser = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: {
      deposit: { where: { status: "accept" } },
      withdraw: { where: { status: "accept" } },
    },
  });
  const bettingAllUser = await prisma.betting.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 100,
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
  const Withdraw = await prisma.withdraw.findMany({
    where: { user_id: session.user.name, status: "accept" },
  });
  const winbetting = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "win" },
  });
  const loseBets = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "lose" },
  });

  const totalWithdraw = Withdraw.reduce(
    (total, withdraw) => total + withdraw.nominal,
    0
  );
  const totBetting = winbetting.reduce(
    (total, betting) => total + betting.nominal,
    0
  );
  let sresultSaldo = totBetting - totalWithdraw;

  // Cek jika ada taruhan yang kalah untuk pengguna
  const userId = session.user.name; // Mengasumsikan session.user.name berisi user_id
  const userLoseBets = loseBets.filter((bet) => bet.user_id === userId);

  // Hitung total kecepatan yang hilang dari taruhan yang kalah berdasarkan user_id
  const totalSpeedLoss = userLoseBets.reduce((total, betting) => total + betting.speed, 0);

  // Kurangi total kecepatan yang hilang dari sresultSaldo
  const resultSaldo = sresultSaldo -= totalSpeedLoss;



  function maxWin() {
    const maxWinUser: any = user?.maxWin || 0;
    const maxWinValue = parseInt(maxWinUser) || 0;
    return userDeposit! + (userDeposit! * maxWinValue) / 100;
  }

  function speed() {
    const totalSpeedLimit = userDeposit! - userWithdraw!;
    if (totalSpeedLimit < 10000) {
      return 0;
    } else if (totalSpeedLimit >= 10000 && totalSpeedLimit < 50000) {
      return 1;
    } else if (totalSpeedLimit >= 50000 && totalSpeedLimit < 100000) {
      return 5;
    } else if (totalSpeedLimit >= 100000 && totalSpeedLimit < 300000) {
      return 10;
    } else if (totalSpeedLimit >= 300000 && totalSpeedLimit < 500000) {
      return 30;
    } else if (totalSpeedLimit >= 500000 && totalSpeedLimit < 1000000) {
      return 50;
    } else if (totalSpeedLimit >= 1000000 && totalSpeedLimit < 3000000) {
      return 100;
    } else if (totalSpeedLimit >= 3000000 && totalSpeedLimit < 5000000) {
      return 300;
    } else if (totalSpeedLimit >= 5000000 && totalSpeedLimit < 10000000) {
      return 500;
    } else if (totalSpeedLimit >= 10000000 && totalSpeedLimit < 30000000) {
      return 1000;
    } else if (totalSpeedLimit >= 30000000 && totalSpeedLimit < 50000000) {
      return 3000;
    } else if (totalSpeedLimit >= 50000000 && totalSpeedLimit < 100000000) {
      return 5000;
    } else if (totalSpeedLimit >= 100000000) {
      return 10000;
    }
  }

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
  } else if (totalBetting >= maxWin()) {
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
        <BettingHistory bettingUser={betting}>
          <title>HeGame - Aviator</title>
          <Gacha
            session={session.user.name}
            totalBetting={resultSaldo}
            speed={speed()!}
            roleUser={roleUser as UserRole} // Ubah tipe roleUser menjadi UserRole
          />

          <div className="overflow-x-auto mt-8">
            <table className="table text-xs font-semibold">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Payout</th>
                  <th>Spend</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {bettingAllUser.map((doc, index) => (
                  <tr key={index}>
                    <GetUserById id={doc.user_id} />
                    <td>{doc.time}x</td>
                    <td>Rp {doc.speed.toLocaleString("id-ID")}</td>
                    <td
                      className={`${doc.status === "win" ? "text-success" : "text-error"
                        }`}
                    >
                      Rp {doc.nominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BettingHistory>
      </MainLayout>
    );
  }
}
