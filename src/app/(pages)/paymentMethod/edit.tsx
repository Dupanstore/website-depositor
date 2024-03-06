import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import prisma from "@/utils/db";
import ButtonForm from "@/app/components/button";
import { IoIosSend } from "react-icons/io";

export default async function EditPaymentMethod({
  id,
  session,
  bankList,
}: {
  id: number;
  session: any;
  bankList: any;
}) {
  const dataRekening = await prisma.rekening.findUnique({
    where: { id },
  });

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
          const response = await prisma.rekening.update({
            where: { id },
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
      redirect("/errorEditPaymentMethod");
    }
  }

  return (
    <>
      <label htmlFor={`edit${id.toString()}`} className="cursor-pointer">
        <FaEdit className="text-info" size={30} />
      </label>

      <input
        type="checkbox"
        id={`edit${id.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Payment Method</h3>

          <form className="grid py-6 gap-4 text-start" action={onSubmit}>
            <div>
              <label htmlFor="input1">Atas Nama Rekening</label>
              <input
                id="input1"
                name="name"
                required
                className="input input-bordered w-full"
                defaultValue={dataRekening?.name}
              />
            </div>

            <div>
              <label htmlFor="input2">Nomor Rekening</label>
              <input
                id="input2"
                name="no_rekening"
                required
                className="input input-bordered w-full"
                defaultValue={dataRekening?.no_rekening}
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
                <option value={dataRekening?.bank}>{dataRekening?.bank}</option>
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
                htmlFor={`edit${id.toString()}`}
              >
                Close
              </label>
              <ButtonForm icon={<IoIosSend size={20} />} text="Send" />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`edit${id.toString()}`}
        ></label>
      </div>
    </>
  );
}
