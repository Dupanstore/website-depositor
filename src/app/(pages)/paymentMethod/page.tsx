import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import prisma from "@/utils/db";
import { MdDelete } from "react-icons/md";

export default async function PaymentMethod() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { rekening: true },
  });

  return (
    <MainLayout>
      <title>Depositor - Payment Method</title>
      <Link href={"/addNewPaymentMethod"} className="btn btn-success">
        <FaPlusCircle size={20} />
        <span>Add New Payment</span>
      </Link>

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
            {userData.rekening.map((doc, index) => (
              <tr className="bg-slate-800" key={index}>
                <td>{index + 1}</td>
                <td>{doc.name}</td>
                <td>{doc.no_rekening}</td>
                <td className="uppercase">{doc.bank}</td>
                <td className="flex items-center justify-center gap-4">
                  <Link href={`/editPaymentMethod/${doc.id}`}>
                    <FaEdit className="text-info" size={30} />
                  </Link>
                  <Link href={`/deletePaymentMethod/${doc.id}`}>
                    <MdDelete className="text-error" size={30} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
