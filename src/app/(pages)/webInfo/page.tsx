import prisma from "@/utils/db";
import DashboardLineChartData from "./chartData";
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
      <DashboardLineChartData />

      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 max-w-2xl m-auto text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Total Deposit All User</span>
          <span className="text-base-300 bg-white rounded-lg w-full py-2">
            Rp {totalAmount.toLocaleString("id-ID")},-
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Speed</span>
          <span className="text-base-300 bg-white rounded-lg w-full py-2">
            Rp 1
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-white">Waiting for the next round</span>
          <div className="flex flex-col items-center justify-center bg-slate-500 rounded-lg py-2 w-full text-white cursor-pointer">
            <span>Rp 50.000</span>
            <span className="text-3xl font-semibold">PLAY</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-10 text-white rounded-lg">
        <table className="table text-center">
          <thead className="text-white">
            <tr className="bg-sky-700">
              <th>Chance ID</th>
              <th>Pemain</th>
              <th>Pemain</th>
              <th>Profit</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-slate-800">
              <td>7121e92a318</td>
              <td>Max</td>
              <td>0.001x</td>
              <td className="text-error">Rp 100.000</td>
            </tr>
            <tr className="bg-slate-800">
              <td>7121e92a318</td>
              <td>Jack</td>
              <td>0.001x</td>
              <td className="text-success">Rp 100.000</td>
            </tr>
            <tr className="bg-slate-800">
              <td>7121e92a318</td>
              <td>Carl</td>
              <td>0.001x</td>
              <td className="text-success">Rp 100.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
