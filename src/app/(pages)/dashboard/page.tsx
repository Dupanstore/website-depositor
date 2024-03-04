import prisma from "@/utils/db";
import AddDeposito from "./addDeposito";
import DashboardLineChartData from "./chartData";
import DataTable from "./dataTable";
import PageRouteSecure from "@/app/components/pageRouteSecure";

export default async function Dashboard() {
  const deposit = await prisma.deposit.findMany();
  const totalAmount = deposit.reduce(
    (total, deposit) => total + deposit.amount,
    0
  );

  return (
    <PageRouteSecure>
      <div className="p-2">
        <AddDeposito totalAmount={totalAmount} />
        <DashboardLineChartData />
        <DataTable />
      </div>
    </PageRouteSecure>
  );
}
