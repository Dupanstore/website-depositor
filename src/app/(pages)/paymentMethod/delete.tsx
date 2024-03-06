import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import ButtonForm from "@/app/components/button";
import { MdDelete } from "react-icons/md";

export default async function DeletePaymentMethod({ id }: { id: number }) {
  async function onSubmit(formData: FormData) {
    "use server";
    async function handleSubmit() {
      try {
        const response = await prisma.rekening.delete({
          where: { id },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const result = await handleSubmit();
    if (result.message === "ok") {
      revalidatePath("/paymentMethod");
    } else {
      redirect("/errorDeleteRekening");
    }
  }

  return (
    <>
      <label htmlFor={`delete${id.toString()}`} className="cursor-pointer">
        <MdDelete className="text-error" size={30} />
      </label>

      <input
        type="checkbox"
        id={`delete${id.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete</h3>
          <p className="py-4 text-xl">Apakah anda yakin ingin menghapusnya ?</p>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <div className="modal-action">
              <label
                className="cursor-pointer btn btn-warning"
                htmlFor={`delete${id.toString()}`}
              >
                Close
              </label>
              <ButtonForm
                text="Delete"
                colors="btn-error"
                icon={<MdDelete size={20} />}
              />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`delete${id.toString()}`}
        ></label>
      </div>
    </>
  );
}
