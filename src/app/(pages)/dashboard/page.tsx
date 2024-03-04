import prisma from "@/utils/db";
import AddDeposito from "./addDeposito";
import DashboardLineChartData from "./chartData";

export default async function Dashboard() {
  const deposit = await prisma.deposit.findMany();
  const totalAmount = deposit.reduce(
    (total, deposit) => total + deposit.amount,
    0
  );

  return (
    <div className="p-4">
      <AddDeposito totalAmount={totalAmount} />
      <DashboardLineChartData />
    </div>
  );
}
