import ButtonForm from "@/app/components/button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import prisma from "@/utils/db";
import { promisify } from "util";
import { join } from "path";
import { writeFile } from "fs";
import { revalidatePath } from "next/cache";

export default async function AddDeposito() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const recipientBank = await prisma.user.findMany({
    where: { role: "admin" },
    include: { rekening: true },
  });
  const senderBank = await prisma.user.findUnique({
    where: { id: session.user.name },
    include: { rekening: true },
  });

  async function onSubmit(formData: FormData) {
    "use server";
    const sender_bank: any = formData.get("sender_bank");
    const recipient_bank: any = formData.get("recipient_bank");
    const nominal_deposit: any = formData.get("nominal_deposit");
    const proof_transaction: any = formData.get("proof_transaction");

    const senderBankDetail: any = await prisma.rekening.findUnique({
      where: { id: parseInt(sender_bank) },
    });
    const recipientBankDetail: any = await prisma.rekening.findUnique({
      where: { id: parseInt(recipient_bank) },
    });

    async function handleSubmit() {
      if (
        !sender_bank ||
        !recipient_bank ||
        !nominal_deposit ||
        proof_transaction.name === "undefined"
      ) {
        return { message: "empty" };
      } else {
        try {
          const saveFileUpload = join(process.cwd(), "./public/assets");
          const fileName = `${Math.random()}_${Date.now()}_${
            proof_transaction.name
          }`;

          const response = await prisma.deposit.create({
            data: {
              nominal_deposit: parseInt(nominal_deposit),
              proof_transaction: fileName,
              status: "pending",

              sender_name: senderBankDetail?.name,
              sender_rekening: senderBankDetail?.no_rekening,
              sender_bank: senderBankDetail?.bank,

              recipient_name: recipientBankDetail?.name,
              recipient_rekening: recipientBankDetail?.no_rekening,
              recipient_bank: recipientBankDetail?.bank,

              user: { connect: { id: session.user.name } },
            },
            include: { user: true },
          });

          const writeFileAsync = promisify(writeFile);
          const bytes = await proof_transaction.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const pathFile = join(saveFileUpload, fileName);
          await writeFileAsync(pathFile, buffer);

          return { message: "success", response };
        } catch (error) {
          return { message: "error", error };
        }
      }
    }

    const result = await handleSubmit();
    if (result.message === "success") {
      revalidatePath("/");
    } else if (result.message === "empty") {
      redirect("/errorAddNewDepositoDataCannotBeEmpty");
    } else {
      redirect("/errorAddDeposito");
    }
  }

  return (
    <>
      <label
        htmlFor="my_modal_7"
        className="text-white transition cursor-pointer text-5xl"
      >
        <FaPlusCircle />
      </label>

      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add New Deposit</h3>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <div>
              <label htmlFor="Nominal" className="text-sm">
                Nominal
              </label>
              <input
                id="Nominal"
                name="nominal_deposit"
                required
                type="number"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label htmlFor="transfer" className="text-sm">
                Upload Bukti Transfer
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                id="transfer"
                required
                accept=".png, .jpg, .jpeg"
                name="proof_transaction"
              />
            </div>

            <div className="grid gap-2 mt-2">
              <span className="text-sm">Pengirim</span>
              <span className="text-xs font-light italic text-error -mt-3">
                *Rekening Anda
              </span>
              {senderBank?.rekening.map((doc, index) => (
                <div className="card bg-base-300" key={index}>
                  <div className="card-body py-3 px-4">
                    <div className="flex items-center gap-1">
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <input
                            type="radio"
                            name="sender_bank"
                            className="radio checked:bg-blue-500"
                            required
                            value={doc.id}
                          />
                        </label>
                      </div>
                      <span className="flex flex-col uppercase">
                        <span className="text-slate-500 text-sm">
                          {doc.bank} - {doc.name}
                        </span>
                        <span>{doc.no_rekening}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 mt-2">
              <span className="text-sm">Penerima</span>
              <span className="text-xs font-light italic text-error -mt-3">
                *Rekening Tujuan
              </span>
              {recipientBank.map((doc) =>
                doc.rekening.map((subDoc, index) => (
                  <div className="card bg-base-300" key={index}>
                    <div className="card-body py-3 px-4">
                      <div className="flex items-center gap-1">
                        <div className="form-control">
                          <label className="label cursor-pointer">
                            <input
                              type="radio"
                              name="recipient_bank"
                              className="radio checked:bg-blue-500"
                              required
                              value={subDoc.id}
                            />
                          </label>
                        </div>
                        <span className="flex flex-col uppercase">
                          <span className="text-slate-500 text-sm">
                            {subDoc.bank} - {subDoc.name}
                          </span>
                          <span>{subDoc.no_rekening}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="modal-action">
              <label className="btn btn-warning" htmlFor="my_modal_7">
                Close
              </label>
              <ButtonForm text="Send" icon={<IoIosSend size={20} />} />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor="my_modal_7"
        ></label>
      </div>
    </>
  );
}
