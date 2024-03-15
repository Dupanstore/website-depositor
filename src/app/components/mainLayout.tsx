import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { FaHome, FaUserAlt, FaUserCircle } from "react-icons/fa";
import prisma from "@/utils/db";
import Logout from "./logout";
import { FaRegIdCard, FaUserCog } from "react-icons/fa";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FaMoneyBill1Wave, FaPlay } from "react-icons/fa6";

const menuLink = [
  {
    path: "/",
    icon: <FaHome size={25} />,
    name: "Home",
  },
  {
    path: "/profile",
    icon: <FaUserAlt size={25} />,
    name: "Profile",
  },
  {
    path: "/withdraw",
    icon: <BiMoneyWithdraw size={25} />,
    name: "Penarikan",
  },
  {
    path: "/paymentMethod",
    icon: <FaRegIdCard size={25} />,
    name: "Payment Method",
  },
  {
    path: "/playEarn",
    icon: <FaPlay size={25} />,
    name: "Play Earn",
  },
];

const menuLinkAdmin = [
  {
    path: "/userDeposit",
    icon: <FaMoneyBill1Wave size={25} />,
    name: "User Deposit",
  },
  {
    path: "/userManagement",
    icon: <FaUserCog size={25} />,
    name: "User Management",
  },
];

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
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
    <>
      <div className="flex items-center justify-between bg-info py-3 px-4 md:px-8 fixed w-full z-10 border-b-8 border-base-100">
        <Link
          href={"/playEarn"}
          className="font-semibold text-2xl text-base-100"
        >
          RIDDLES
        </Link>

        <label htmlFor="account" className="text-base-100 cursor-pointer">
          <FaUserCircle size={35} />
        </label>

        <input type="checkbox" id="account" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <div className="card bg-info max-w-md m-auto">
              <div className="card-body">
                <div className="text-white">
                  <div>
                    <h1 className="text-2xl font-medium -mb-2 text-base-100">
                      {userData?.username}
                    </h1>
                    <p className="text-base-100 text-sm mb-2">
                      {userData?.email}
                    </p>
                    <p className="text-xs -mb-2 text-base-100">Total Earn</p>
                    <p className="text-3xl font-semibold text-base-100">
                      Rp. {resultSaldo?.toLocaleString("id-ID")},-
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 py-6 max-w-md m-auto">
              {menuLink.map((doc, index) => (
                <Link
                  key={index}
                  href={doc.path}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-info text-base-100 p-3 rounded-xl">
                      {doc.icon}
                    </div>
                    <p>{doc.name}</p>
                  </div>
                  <div className="text-info font-bold text-lg">{">"}</div>
                </Link>
              ))}

              {userData?.role === "admin" &&
                menuLinkAdmin.map((doc, index) => (
                  <Link
                    key={index}
                    href={doc.path}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-info text-base-100 p-3 rounded-xl">
                        {doc.icon}
                      </div>
                      <p>{doc.name}</p>
                    </div>
                    <div className="text-info font-bold text-lg">{">"}</div>
                  </Link>
                ))}

              <Logout />
            </div>

            <div className="modal-action">
              <label className="btn btn-warning" htmlFor="account">
                Close
              </label>
            </div>
          </div>

          <label
            className="modal-backdrop cursor-pointer"
            htmlFor="account"
          ></label>
        </div>
      </div>

      <div className="px-2 py-20">{children}</div>
    </>
  );
}
