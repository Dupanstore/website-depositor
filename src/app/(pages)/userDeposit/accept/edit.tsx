import ButtonForm from "@/app/components/button";
import { FaEdit } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function EditDeposit({
  userId,
  depositId,
}: {
  userId: number;
  depositId: number;
}) {
  const userMaxWin = await prisma.user.findUnique({ where: { id: userId } });

  async function onSubmit(formData: FormData) {
    "use server";
    const maxWin: any = formData.get("maxWin");
    const status: any = formData.get("status");

    async function handleSubmit() {
      try {
        const responseMaxWin = await prisma.user.update({
          where: { id: userId },
          data: { maxWin: parseInt(maxWin) },
        });

        const responseStatus = await prisma.deposit.update({
          where: { id: depositId },
          data: { status },
        });
        return { message: "ok", responseMaxWin, responseStatus };
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
      <label
        htmlFor={`maxwin${depositId}`}
        className="text-info cursor-pointer"
      >
        <FaEdit size={25} />
      </label>

      <input
        type="checkbox"
        id={`maxwin${depositId}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box text-start">
          <h3 className="text-lg font-bold mb-8">Edit</h3>

          <form action={onSubmit} className="flex flex-col gap-4">
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

            <div>
              <label htmlFor="Status">Status</label>
              <select
                className="select select-bordered w-full"
                id="Status"
                required
                name="status"
              >
                <option value={"accept"}>ACCEPT</option>
                <option value={"reject"}>REJECT</option>
              </select>
            </div>

            <div className="modal-action">
              <label
                className="btn btn-warning cursor-pointer text-white"
                htmlFor={`maxwin${depositId}`}
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
          htmlFor={`maxwin${depositId}`}
        ></label>
      </div>
    </>
  );
}
