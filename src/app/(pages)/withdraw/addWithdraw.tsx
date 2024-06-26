import ButtonForm from "@/app/components/button";
import { redirect } from "next/navigation";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { FaPlusCircle } from "react-icons/fa";

export default async function AddWithdraw({ session  }: { session: any 
}) {
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: {
      deposit: true,
      rekening: true,
      betting: { where: { status: "win" } },
      withdraw: { where: { status: "accept" } },
    },
  });
  const Withdraw = await prisma.withdraw.findMany({
    where: { user_id: session.user.name, status: "accept" },
  });
  const winbetting = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "win" },
  });
  const loseBets = await prisma.betting.findMany({
    where: { user_id: session.user.name, status: "lose" },
  });
  
  const totalWithdraw = Withdraw.reduce(
    (total, withdraw) => total + withdraw.nominal,
    0
  );
  const totBetting = winbetting.reduce(
    (total, betting) => total + betting.nominal,
    0
  );
  let sresultSaldo = totBetting - totalWithdraw;

  // Cek jika ada taruhan yang kalah untuk pengguna
  const userId = session.user.name; // Mengasumsikan session.user.name berisi user_id
  const userLoseBets = loseBets.filter((bet) => bet.user_id === userId);

  // Hitung total kecepatan yang hilang dari taruhan yang kalah berdasarkan user_id
  const totalSpeedLoss = userLoseBets.reduce((total, betting) => total + betting.speed, 0);

  // Kurangi total kecepatan yang hilang dari sresultSaldo
  const resultSaldo = sresultSaldo -= totalSpeedLoss;
 
  async function onSubmit(formData: FormData) {
    "use server";
    const bank: any = formData.get("bank");
    const nominal: any = formData.get("totalWithdraw");

    async function handleSubmit() {
      if (!bank || !nominal) {
        return { message: "dataNull" };
      } else {
        const bankDetail = await prisma.rekening.findUnique({
          where: { id: parseInt(bank) },
        });

        if (nominal > resultSaldo) {
          return { message: "balanceNotEnough" };
        } else {
          try {
            const response = await prisma.withdraw.create({
              data: {
                name: bankDetail?.name!,
                bank: bankDetail?.bank!,
                no_rekening: bankDetail?.no_rekening!,
                nominal: parseInt(nominal),
                status: "pending",
                user: { connect: { id: session.user.name } },
              },
              include: { user: true },
            });
            return { message: "ok", response };
          } catch (error) {
            return { message: "error", error };
          }
        }
      }
    }

    const response = await handleSubmit();
    if (response?.message === "ok") {
      redirect("/withdrawSuccess");
    } else if (response?.message === "balanceNotEnough") {
      redirect("/withdrawBalanceNotEnough");
    } else if (response?.message === "dataNull") {
      redirect("/withdrawDataCannotBeEmpty");
    } else {
      redirect("/withdrawError");
    }
  }

  return (
    <>
      <label htmlFor="my_modal_7" className="btn btn-success">
        <FaPlusCircle size={20} />
        <span>Withdraw</span>
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Withdraw</h3>

          <div className="card bg-blue-600 shadow-xl mb-4">
            <div className="card-body text-center text-white">
              <span className="font-medium text-2xl -mb-3">
                Rp {resultSaldo.toLocaleString("id-ID")},-
              </span>
              <span className="text-xs">Saldo</span>
            </div>
          </div>

          <form className="flex flex-col gap-4" action={onSubmit}>
            <div>
              <label htmlFor="bank" className="text-sm">
                Silahkan Pilih Rekening Bank
              </label>
              <select
                name="bank"
                id="bank"
                className="select select-bordered w-full"
                required
              >
                {userData?.rekening.map((doc) => (
                  <option value={doc.id} key={doc.id}>
                    {doc.name} - {doc.no_rekening} - {doc.bank.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="totalWithdraw" className="text-sm">
                Jumlah Penarikan
              </label>
              <input
                required
                type="number"
                name="totalWithdraw"
                className="input input-bordered w-full"
              />
            </div>

            <div className="modal-action">
              <label className="btn btn-warning" htmlFor="my_modal_7">
                Close
              </label>
              <ButtonForm text="Send" icon={<IoIosSend size={20} />} />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor="my_modal_7"
        ></label>
      </div>
    </>
  );
}
