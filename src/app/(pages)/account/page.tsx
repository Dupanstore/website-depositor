import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import Link from "next/link";
import Logout from "@/app/components/logout";
import { FaRegIdCard } from "react-icons/fa";

const menuLink = [
  {
    path: "/userPayment",
    icon: <FaRegIdCard size={25} />,
    name: "Informasi Bank",
  },
];

export default async function Account() {
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
    <MainLayout>
      <title>Depositor - Account</title>
      <div className="card bg-info max-w-md m-auto">
        <div className="card-body">
          <div className="text-white">
            <div>
              <h1 className="text-2xl font-medium text-base-100">
                {userData?.username}
              </h1>
              <p className="text-xs -mb-2 text-base-100">Total Saldo</p>
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

        <Logout />
      </div>
    </MainLayout>
  );
}
