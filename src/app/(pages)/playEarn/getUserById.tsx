import prisma from "@/utils/db";

export default async function GetUserById({ id }: { id: number }) {
  const data = await prisma.user.findUnique({ where: { id } });
  return <td>{data?.username}</td>;
}
