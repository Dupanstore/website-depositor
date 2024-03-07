import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { FaHome, FaUserCircle } from "react-icons/fa";
import prisma from "@/utils/db";
import Logout from "./logout";
import { FaRegIdCard, FaUserCog } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { TbWorldWww } from "react-icons/tb";

const menuLink = [
  {
    path: "/",
    icon: <FaHome size={25} />,
    name: "Home",
  },
  {
    path: "/paymentMethod",
    icon: <FaRegIdCard size={25} />,
    name: "Payment Method",
  },
  {
    path: "/webInfo",
    icon: <TbWorldWww size={25} />,
    name: "Web Info",
  },
];

const menuLinkAdmin = [
  {
    path: "/userManagement",
    icon: <FaUserCog size={25} />,
    name: "User Management",
  },
  {
    path: "/listBankManagement",
    icon: <BsBank2 size={25} />,
    name: "List Bank",
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
    include: { deposit: true },
  });
  const totalAmount = userData?.deposit.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );

  return (
    <>
      <div className="flex items-center justify-between bg-info py-3 px-4 md:px-8 fixed w-full z-10 border-b-8 border-base-100">
        <Link href={"/"} className="font-semibold text-2xl text-base-100">
          DEPOSITOR
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
                    <p className="text-base-100 text-sm mb-2">{userData?.email}</p>
                    <p className="text-xs -mb-2 text-base-100">Total Deposit</p>
                    <p className="text-3xl font-semibold text-base-100">
                      Rp. {totalAmount?.toLocaleString("id-ID")},-
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
