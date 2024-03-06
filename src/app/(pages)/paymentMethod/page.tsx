import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import AddNewPaymentMethod from "./addNew";
import DeletePaymentMethod from "./delete";
import EditPaymentMethod from "./edit";

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
      <title>Depositor - Payment Method</title>
      <AddNewPaymentMethod session={session} bankList={bankList} />
      <div className="overflow-x-auto mt-6 rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-info">
              <th>No</th>
              <th>Atas Nama</th>
              <th>Nomor Rekening</th>
              <th>Bank</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {userData.rekening.map((doc: any, index: any) => (
              <tr className="bg-slate-800" key={index}>
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
