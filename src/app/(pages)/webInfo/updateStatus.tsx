import ButtonForm from "@/app/components/button";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";
import { MdCancel } from "react-icons/md";
import prisma from "@/utils/db";

export default async function UpdateStatusUserDeposit({ id }: { id: number }) {
  async function onSubmitAccept(formData: FormData) {
    "use server";
    const status: any = formData.get("status");
    async function handleStatusSubmit() {
      try {
        if (status === "accepted") {
          const response = await prisma.deposit.update({
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
      revalidatePath("/webInfo");
    }
  }

  async function onSubmitRejected(formData: FormData) {
    "use server";
    const status: any = formData.get("status");
    async function handleStatusSubmit() {
      try {
        if (status === "rejected") {
          const response = await prisma.deposit.update({
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
      revalidatePath("/webInfo");
    }
  }

  return (
    <>
      <label
        htmlFor={`updateStatus${id.toString()}`}
        className="cursor-pointer"
      >
        <FcInfo className="text-error" size={30} />
      </label>

      <input
        type="checkbox"
        id={`updateStatus${id.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Update Status</h3>
          <p className="py-4">Apakah anda ingin Menerima atau Menolak ?</p>

          <div className="modal-action flex items-center">
            <label
              className="cursor-pointer btn btn-warning"
              htmlFor={`updateStatus${id.toString()}`}
            >
              Close
            </label>

            <form className="grid py-6 gap-4" action={onSubmitRejected}>
              <input className="hidden" name="status" value={"rejected"} />
              <ButtonForm
                text="Reject"
                colors="btn-error"
                icon={<MdCancel size={20} />}
              />
            </form>

            <form className="grid py-6 gap-4" action={onSubmitAccept}>
              <input className="hidden" name="status" value={"accepted"} />
              <ButtonForm
                text="Accepted"
                colors="btn-info"
                icon={<FaCheckCircle size={20} />}
              />
            </form>
          </div>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`updateStatus${id.toString()}`}
        >
          Close
        </label>
      </div>
    </>
  );
}
