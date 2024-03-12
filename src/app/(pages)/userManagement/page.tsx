import MainLayout from "@/app/components/mainLayout";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DeleteUser from "./delete";
import EditUser from "./edit";

export default async function UserManagement() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  if (user?.role === "user") {
    redirect("/");
  }
  const users = await prisma.user.findMany();

  return (
    <MainLayout>
      <title>Riddles - User Management</title>
      <div className="overflow-x-auto rounded-xl">
        <table className="table text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doc.username}</td>
                <td>{doc.email}</td>
                <td className="capitalize">{doc.role}</td>
                <td className="flex items-center justify-center gap-4">
                  <EditUser id={doc.id} />
                  {doc.role === "user" && <DeleteUser id={doc.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
