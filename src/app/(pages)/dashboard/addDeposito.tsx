import { redirect } from "next/navigation";
import ButtonSubmit from "./buttonSubmit";
import prisma from "@/utils/db";
import Logout from "@/app/components/logout";

export default function AddDeposito({ totalAmount }: { totalAmount: number }) {
  async function submitDeposit(formData: FormData) {
    "use server";
    const amountStr: any = formData.get("amount");
    const deposit: any = formData.get("deposit");
    const amount: any = parseInt(amountStr);

    async function addData() {
      try {
        const deposito = await prisma.deposit.create({
          data: { deposit, amount },
        });
        return { message: "ok", deposito };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const response = await addData();
    if (response.message === "ok") {
      redirect("/addDepositoSuccess");
    } else {
      redirect("/errorAddDeposito");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-4 bg-slate-950 text-white w-max p-3 rounded-xl px-4">
        <span className="rounded-full bg-red-500 text-white p-1 text-xs">
          Rp
        </span>
        <span className="text-xl">{totalAmount.toLocaleString("id-ID")},-</span>
      </div>

      <label
        htmlFor="my_modal_7"
        className="btn btn-success text-4xl text-white"
      >
        +
      </label>
      <Logout />
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />

      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add New Deposit</h3>

          <form className="mt-6 grid gap-4" action={submitDeposit}>
            <input
              className="input input-bordered w-full"
              placeholder="Deposit"
              name="deposit"
              required
            />

            <input
              className="input input-bordered w-full"
              placeholder="Total"
              name="amount"
              type="number"
              required
            />

            <div className="modal-action">
              <ButtonSubmit />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor="my_modal_7"
        ></label>
      </div>
    </div>
  );
}
