import ButtonForm from "@/app/components/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { FaRegCircleQuestion } from "react-icons/fa6";

export default async function deletePaymentMethod({ params }: any) {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const dataRekening = await prisma.rekening.findUnique({
    where: { id: parseInt(params.slug) },
  });

  async function onSubmit(formData: FormData) {
    "use server";
    async function handleSubmit() {
      try {
        const response = await prisma.rekening.delete({
          where: { id: parseInt(params.slug) },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const result = await handleSubmit();
    if (result.message === "ok") {
      redirect("/paymentMethod");
    } else {
      redirect("/errorDeleteRekening");
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Depositor - Delete Payment Method</title>
      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <FaRegCircleQuestion size={100} className="text-info" />
          <h1 className="text-4xl font-semibold">Delete</h1>
          <p className="py-4 text-xl text-center">
            Apakah anda yakin ingin menghapus rekening{" "}
            <span className="uppercase text-error font-semibold">
              {dataRekening?.name}
            </span>
          </p>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <div className="modal-action flex justify-between">
              <Link className="btn btn-error" href={"/paymentMethod"}>
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
