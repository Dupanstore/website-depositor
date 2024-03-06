import ButtonForm from "@/app/components/button";
import { MdDelete } from "react-icons/md";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function DeletePaymentMethod({
  doc,
}: {
  doc: { id: number; name: string };
}) {
  async function onSubmit(formData: FormData) {
    "use server";
    const rekId: any = formData.get("id");
    async function handleDelete() {
      try {
        const response = await prisma.rekening.delete({
          where: { id: parseInt(rekId) },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const result = await handleDelete();
    if (result.message === "ok") {
      revalidatePath("/paymentMethod");
    } else {
      redirect("/errorDeleteRekening");
    }
  }
  return (
    <>
      <label
        htmlFor={doc.id.toString()}
        className="cursor-pointer flex items-center justify-center"
      >
        <MdDelete className="text-error" size={30} />
      </label>

      <input type="checkbox" id={doc.id.toString()} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box text-start capitalize">
          <h3 className="text-lg font-bold">Delete</h3>
          <p className="py-4">
            Apakah anda yakin ingin menghapus metode pembayaran atas nama{" "}
            <span className="text-error uppercase font-semibold">
              {doc.name}
            </span>
          </p>

          <form action={onSubmit}>
            <input name="id" value={doc.id} className="hidden" />
            <div className="modal-action">
              <ButtonForm
                icon={<MdDelete size={20} />}
                text="Delete"
                colors="btn-error"
              />
            </div>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor={doc.id.toString()}></label>
      </div>
    </>
  );
}
