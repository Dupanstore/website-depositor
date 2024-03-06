import MainLayout from "@/app/components/mainLayout";
import prisma from "@/utils/db";
import Link from "next/link";

export default async function UserManagement() {
  const users = await prisma.user.findMany({ where: { role: "admin" } });

  return (
    <MainLayout>
      <title>Depositor - User Management</title>

      <div className="mb-6 border-b p-2 border-slate-500 flex gap-4">
        <Link href={"/userManagement"}>User</Link>
        <Link href={"/userManagement/admin"} className="text-info">
          Admin
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl text-white">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-info">
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((doc, index) => (
              <tr className="bg-slate-800" key={index}>
                <td>{index + 1}</td>
                <td>{doc.username}</td>
                <td>{doc.email}</td>
                <td></td>
                {/* <td className="flex items-center justify-center gap-4">
                  <Link href={`/editPaymentMethod/${doc.id}`}>
                    <FaEdit className="text-info" size={30} />
                  </Link>
                  <Link href={`/deletePaymentMethod/${doc.id}`}>
                    <MdDelete className="text-error" size={30} />
                  </Link>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
