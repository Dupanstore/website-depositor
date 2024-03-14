import prisma from "@/utils/db";

export default async function GetUserMaxWin({ id }: { id: number }) {
  const data = await prisma.user.findUnique({ where: { id } });
  return <td>{data?.maxWin}%</td>;
}
