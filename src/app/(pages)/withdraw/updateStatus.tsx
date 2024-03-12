import ButtonForm from "@/app/components/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import prisma from "@/utils/db";

export default async function UpdateStatusWithdraw({ id }: { id: number }) {
  async function onSubmitAccept(formData: FormData) {
    "use server";
    const status: any = formData.get("status");
    async function handleStatusSubmit() {
      try {
        if (status === "accepted") {
          const response = await prisma.withdraw.update({
            where: { id },
            data: { status: "accept" },
          });
          return { message: "ok", response };
        } else {
          return { message: "error" };
        }
      } catch (error) {
        return { message: "error", error };
      }
    }
    const result = await handleStatusSubmit();
    if (result.message === "error") {
      redirect("/errorUpdateStatus");
    } else {
      revalidatePath("/withdrawHistory");
    }
  }

  async function onSubmitRejected(formData: FormData) {
    "use server";
    const status: any = formData.get("status");
    async function handleStatusSubmit() {
      try {
        if (status === "rejected") {
          const response = await prisma.withdraw.update({
            where: { id },
            data: { status: "reject" },
          });
          return { message: "ok", response };
        } else {
          return { message: "error" };
        }
      } catch (error) {
        return { message: "error", error };
      }
    }
    const result = await handleStatusSubmit();
    if (result.message === "error") {
      redirect("/errorUpdateStatus");
    } else {
      revalidatePath("/withdrawHistory");
    }
  }

  return (
    <>
      <label
        htmlFor={`updateStatusWithdraw${id.toString()}`}
        className="cursor-pointer"
      >
        <FaInfoCircle className="text-warning" size={30} />
      </label>

      <input
        type="checkbox"
        id={`updateStatusWithdraw${id.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Update Status</h3>
          <p className="py-4">Apakah anda ingin Menerima atau Menolak ?</p>

          <div className="modal-action flex items-center">
            <label
              className="cursor-pointer btn btn-warning text-white"
              htmlFor={`updateStatusWithdraw${id.toString()}`}
            >
              Close
            </label>

            <form className="grid py-6 gap-4" action={onSubmitRejected}>
              <input className="hidden" name="status" value={"rejected"} />
              <ButtonForm
                text="Reject"
                colors="btn-error text-white"
                icon={<MdCancel size={20} />}
              />
            </form>

            <form className="grid py-6 gap-4" action={onSubmitAccept}>
              <input className="hidden" name="status" value={"accepted"} />
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
          htmlFor={`updateStatusWithdraw${id.toString()}`}
        ></label>
      </div>
    </>
  );
}
