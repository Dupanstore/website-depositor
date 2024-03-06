import ButtonForm from "@/app/components/button";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function AddNewPaymentMethod({
  session,
  bankList,
}: {
  session: any;
  bankList: any;
}) {
  async function onSubmit(formData: FormData) {
    "use server";
    const name: any = formData.get("name");
    const no_rekening: any = formData.get("no_rekening");
    const bank: any = formData.get("bank");

    async function handleSubmit() {
      if (!name || !no_rekening || !bank) {
        return { message: "empty" };
      } else {
        try {
          const response = await prisma.rekening.create({
            data: {
              name,
              no_rekening,
              bank,
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

    const result = await handleSubmit();
    if (result.message === "ok") {
      revalidatePath("/paymentMethod");
    } else {
      redirect("/errorAddPaymentMethod");
    }
  }

  return (
    <>
      <label htmlFor="addPayment" className="btn btn-success">
        <FaPlusCircle size={20} />
        <span>Add New Payment</span>
      </label>

      <input type="checkbox" id="addPayment" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add New Payment Method</h3>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <div>
              <label htmlFor="input1">Atas Nama Rekening</label>
              <input
                id="input1"
                name="name"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="input2">Nomor Rekening</label>
              <input
                id="input2"
                name="no_rekening"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="select1">Bank</label>
              <select
                className="select select-bordered w-full uppercase"
                id="select2"
                name="bank"
                required
              >
                {bankList.map((doc: any, index: any) => (
                  <option key={index} value={doc.bank}>
                    {doc.bank}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-action">
              <label
                className="btn btn-warning cursor-pointer"
                htmlFor="addPayment"
              >
                Close
              </label>
              <ButtonForm icon={<IoIosSend size={20} />} text="Send" />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor="addPayment"
        ></label>
      </div>
    </>
  );
}
