import ButtonForm from "@/app/components/button";
import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import prisma from "@/utils/db";

export default async function EditPaymentMethod({ params }: any) {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const bankList = await prisma.bank.findMany();
  const dataRekening = await prisma.rekening.findUnique({
    where: { id: parseInt(params.slug) },
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
            where: { id: parseInt(params.slug) },
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
      redirect("/paymentMethod");
    } else {
      redirect("/errorEditPaymentMethod");
    }
  }

  return (
    <MainLayout>
      <title>Depositor - Edit Payment Method</title>
      <div className="max-w-md m-auto">
        <h3 className="text-lg font-bold">Edit Payment Method</h3>

        <form className="grid py-6 gap-4" action={onSubmit}>
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
              {bankList.map((doc, index) => (
                <option key={index} value={doc.bank}>
                  {doc.bank}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-action flex justify-between">
            <Link className="btn btn-info" href={"/paymentMethod"}>
              <IoMdArrowRoundBack size={20} />
              <span>Back</span>
            </Link>
            <ButtonForm icon={<IoIosSend size={20} />} text="Send" />
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
