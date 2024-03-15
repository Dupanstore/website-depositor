import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import AddNewPaymentMethod from "./addNew";
import DeletePaymentMethod from "./delete";
import EditPaymentMethod from "./edit";
import Link from "next/link";
import { BsBank2 } from "react-icons/bs";

export default async function PaymentMethod() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData: any = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { rekening: true },
  });
  const bankList = await prisma.bank.findMany();

  return (
    <MainLayout>
      <title>Ridlles - Payment Method</title>
      <div className="flex gap-2">
        <AddNewPaymentMethod session={session} bankList={bankList} />
        {userData.role === "admin" && (
          <Link href={"/listBankManagement"} className="btn btn-info">
            <BsBank2 size={20} />
            List Bank
          </Link>
        )}
      </div>
      <div className="overflow-x-auto mt-6 rounded-xl">
        <table className="table text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Atas Nama</th>
              <th>Nomor Rekening</th>
              <th>Bank</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {userData.rekening.map((doc: any, index: any) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doc.name}</td>
                <td>{doc.no_rekening}</td>
                <td className="uppercase">{doc.bank}</td>
                <td className="flex items-center justify-center gap-4">
                  <EditPaymentMethod
                    session={session}
                    id={doc.id}
                    bankList={bankList}
                  />
                  <DeletePaymentMethod id={doc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
