import ButtonForm from "@/app/components/button";
import { FaEdit } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditMaxWin({ id }: { id: number }) {
  const userMaxWin = await prisma.user.findUnique({ where: { id } });

  async function onSubmit(formData: FormData) {
    "use server";
    const maxWin: any = formData.get("maxWin");

    async function handleSubmit() {
      try {
        const response = await prisma.user.update({
          where: { id },
          data: { maxWin: parseInt(maxWin) },
        });
        return { message: "ok", response };
      } catch (error) {
        return { error, message: "error" };
      }
    }

    const result = await handleSubmit();
    if (result.message === "ok") {
      revalidatePath("/userDeposit/accept");
    } else {
      redirect("/serverError");
    }
  }

  return (
    <>
      <label htmlFor={`maxwin${id}`} className="text-info cursor-pointer">
        <FaEdit size={25} />
      </label>

      <input type="checkbox" id={`maxwin${id}`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box text-start">
          <h3 className="text-lg font-bold mb-8">Max Win(%)</h3>

          <form action={onSubmit}>
            <div>
              <label htmlFor="maxWin">Max Win(%)</label>
              <input
                id="maxWin"
                name="maxWin"
                className="input input-bordered w-full"
                type="number"
                defaultValue={userMaxWin?.maxWin}
                required
              />
            </div>

            <div className="modal-action">
              <label
                className="btn btn-warning cursor-pointer text-white"
                htmlFor={`maxwin${id}`}
              >
                Close
              </label>
              <ButtonForm
                text="Send"
                colors="btn-success text-white"
                icon={<IoIosSend size={20} />}
              />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`maxwin${id}`}
        ></label>
      </div>
    </>
  );
}
