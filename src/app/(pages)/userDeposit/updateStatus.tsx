import ButtonForm from "@/app/components/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";
import { MdCancel } from "react-icons/md";
import prisma from "@/utils/db";

export default async function UpdateStatusUserDeposit({
  idDeposit,
  idUser,
}: {
  idDeposit: number;
  idUser: number;
}) {
  async function onSubmitAccept(formData: FormData) {
    "use server";
    const maxWin: any = formData.get("maxWin");
    async function handleStatusSubmit() {
      try {
        const responseMaxWin = await prisma.user.update({
          where: { id: idUser },
          data: { maxWin: parseInt(maxWin) },
        });
        const responseDeposit = await prisma.deposit.update({
          where: { id: idDeposit },
          data: { status: "accept" },
        });
        return { message: "ok", responseDeposit, responseMaxWin };
      } catch (error) {
        return { message: "error", error };
      }
    }
    const result = await handleStatusSubmit();
    if (result.message === "error") {
      redirect("/errorUpdateStatus");
    } else {
      revalidatePath("/webInfo");
    }
  }

  async function onSubmitRejected() {
    "use server";
    async function handleStatusSubmit() {
      try {
        const response = await prisma.deposit.update({
          where: { id: idDeposit },
          data: { status: "reject" },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }
    const result = await handleStatusSubmit();
    if (result.message === "error") {
      redirect("/errorUpdateStatus");
    } else {
      revalidatePath("/webInfo");
    }
  }

  return (
    <>
      <label
        htmlFor={`updateStatus${idDeposit.toString()}`}
        className="cursor-pointer"
      >
        <FcInfo className="text-error" size={30} />
      </label>

      <input
        type="checkbox"
        id={`updateStatus${idDeposit.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box relative">
          <h3 className="text-lg font-bold">Update Status</h3>
          <p className="py-4">Apakah anda ingin Menerima atau Menolak ?</p>

          <div className="modal-action flex items-center pt-14">
            <label
              className="cursor-pointer btn btn-warning text-white"
              htmlFor={`updateStatus${idDeposit.toString()}`}
            >
              Close
            </label>

            <form className="grid py-6 gap-4" action={onSubmitRejected}>
              <ButtonForm
                text="Reject"
                colors="btn-error text-white"
                icon={<MdCancel size={20} />}
              />
            </form>

            <form className="grid py-6 gap-4" action={onSubmitAccept}>
              <div className="absolute text-start left-6 top-32 right-6">
                <label htmlFor="maxWin">Max Win(%)</label>
                <input
                  id="maxWin"
                  name="maxWin"
                  className="input input-bordered w-full"
                  type="number"
                  required
                />
              </div>

              <ButtonForm
                text="Accepted"
                colors="btn-info text-white"
                icon={<FaCheckCircle size={20} />}
              />
            </form>
          </div>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`updateStatus${idDeposit.toString()}`}
        >
          Close
        </label>
      </div>
    </>
  );
}
