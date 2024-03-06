import MainLayout from "@/app/components/mainLayout";
import ButtonSendNewBank from "./button";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DeleteBank from "./deleteBank";

export default async function ListBankManagement() {
  const bankList = await prisma.bank.findMany();

  async function onSubmit(formData: FormData) {
    "use server";
    const bank: any = formData.get("bank");
    const formatText = bank.toLowerCase();
    async function handleSubmit() {
      try {
        const response = await prisma.bank.create({
          data: { bank: formatText },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const result = await handleSubmit();
    if (result.message === "ok") {
      revalidatePath("/listBankManagement");
    } else {
      redirect("/errorBankAlreadyExist");
    }
  }

  return (
    <MainLayout>
      <title>Depositor - Bank Management</title>
      <div className="max-w-md m-auto">
        <form className="flex gap-4" action={onSubmit}>
          <input
            className="input input-bordered w-full"
            required
            placeholder="New Bank"
            name="bank"
          />
          <ButtonSendNewBank />
        </form>

        <div className="overflow-x-auto mt-6 rounded-xl text-white">
          <table className="table text-center">
            <thead className="text-white">
              <tr className="bg-info">
                <th>No</th>
                <th>Bank</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bankList.map((doc, index) => (
                <tr className="bg-slate-800 uppercase" key={index}>
                  <td>{index + 1}</td>
                  <td>{doc.bank}</td>
                  <td>
                    <DeleteBank doc={doc} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
