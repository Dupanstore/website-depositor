import ButtonForm from "@/app/components/button";
import { redirect } from "next/navigation";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { FaPlusCircle } from "react-icons/fa";

export default async function AddWithdraw({ session }: { session: any }) {
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: {
      deposit: true,
      rekening: true,
      betting: true,
      withdraw: { where: { status: "accept" } },
    },
  });
  const totalBetting = userData?.betting.reduce(
    (total, betting) => total + betting.nominal,
    0
  );
  const totalWithdraw = userData?.withdraw.reduce(
    (total, withdraw) => total + withdraw.nominal,
    0
  );
  const result = totalBetting! - totalWithdraw!;

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

        if (nominal > result) {
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
                Rp {result.toLocaleString("id-ID")},-
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
