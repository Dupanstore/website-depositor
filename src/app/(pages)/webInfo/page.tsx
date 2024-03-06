import prisma from "@/utils/db";
import AddDeposito from "./addDeposito";
import DashboardLineChartData from "./chartData";
import DataTable from "./dataTable";
import MainLayout from "@/app/components/mainLayout";

export default async function AdminDashboard() {
  const deposit = await prisma.deposit.findMany();
  const totalAmount = deposit.reduce(
    (total, deposit) => total + deposit.nominal_deposit,
    0
  );

  return (
    <MainLayout>
      <title>Depositor - Web Info</title>
      <AddDeposito totalAmount={totalAmount} />
      <DashboardLineChartData />
      <DataTable />
    </MainLayout>
  );
}
