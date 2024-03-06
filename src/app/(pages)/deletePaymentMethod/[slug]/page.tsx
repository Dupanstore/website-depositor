import ButtonForm from "@/app/components/button";
import MainLayout from "@/app/components/mainLayout";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import prisma from "@/utils/db";
import { FaRegCircleQuestion } from "react-icons/fa6";

export default async function deletePaymentMethod({ params }: any) {
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
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Depositor - Delete Payment Method</title>
      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <FaRegCircleQuestion size={100} className="text-error" />
          <h1 className="text-4xl font-semibold">Error</h1>
          <p className="py-4 text-2xl">Data Cannot Be Empty</p>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <div className="modal-action flex justify-between">
              <Link className="btn btn-info" href={"/paymentMethod"}>
                <IoMdArrowRoundBack size={20} />
                <span>No</span>
              </Link>
              <ButtonForm text="Yes" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
