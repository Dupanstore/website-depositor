import prisma from "@/utils/db";
import MainLayout from "@/app/components/mainLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Gacha from "./gacha";
import { VscError } from "react-icons/vsc";
import Link from "next/link";
import BettingHistory from "./history";

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
    if (userDeposit! < 10000) {
      return 1;
    } else if (userDeposit! >= 10000 && userDeposit! < 50000) {
      return 5;
    } else if (userDeposit! >= 50000 && userDeposit! < 100000) {
      return 10;
    } else if (userDeposit! >= 100000 && userDeposit! < 300000) {
      return 30;
    } else if (userDeposit! >= 300000 && userDeposit! < 500000) {
      return 50;
    } else if (userDeposit! >= 500000 && userDeposit! < 1000000) {
      return 100;
    } else if (userDeposit! >= 1000000 && userDeposit! < 3000000) {
      return 300;
    } else if (userDeposit! >= 3000000 && userDeposit! < 5000000) {
      return 500;
    } else if (userDeposit! >= 5000000 && userDeposit! < 10000000) {
      return 1000;
    } else if (userDeposit! >= 10000000 && userDeposit! < 30000000) {
      return 3000;
    } else if (userDeposit! >= 30000000 && userDeposit! < 50000000) {
      return 5000;
    } else if (userDeposit! >= 50000000 && userDeposit! < 100000000) {
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
        <BettingHistory betting={betting}>
          <title>Riddles - Play Earn</title>
          <Gacha
            session={session.user.name}
            totalBetting={totalCashout}
            speed={speed!}
          />
        </BettingHistory>
      </MainLayout>
    );
  }
}
