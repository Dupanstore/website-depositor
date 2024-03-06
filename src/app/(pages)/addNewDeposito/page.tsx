import Link from "next/link";
import ButtonSendDeposit from "./button";
import { IoMdArrowRoundBack } from "react-icons/io";
import Image from "next/image";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth";
import { join } from "path";
import { writeFile } from "fs";
import { promisify } from "util";
import MainLayout from "@/app/components/mainLayout";

const dataBankSender = [
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bca", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
];

const dataBankRecipient = [
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bca", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
];

export default async function AddNewDeposito() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  async function onSubmit(formData: FormData) {
    "use server";
    const sender_bank: any = formData.get("sender_bank");
    const recipient_bank: any = formData.get("recipient_bank");
    const nominal_deposit: any = formData.get("nominal_deposit");
    const proof_transaction: any = formData.get("proof_transaction");

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
              status: "submit",
              sender_bank,
              recipient_bank: parseInt(recipient_bank),
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
      redirect("/");
    } else if (result.message === "empty") {
      redirect("/errorAddNewDepositoDataCannotBeEmpty");
    } else {
      redirect("/errorAddDeposito");
    }
  }

  return (
    <MainLayout>
      <title>Depositor - Add New Deposit</title>
      <div className="max-w-md m-auto">
        <h3 className="text-lg font-bold">Add New Deposit</h3>

        <form className="grid py-6 gap-4" action={onSubmit}>
          <div>
            <label htmlFor="Nominal">Nominal</label>
            <input
              id="Nominal"
              name="nominal_deposit"
              required
              type="number"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="transfer">Upload Bukti Transfer</label>
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
            <span>Pengirim</span>
            <span className="text-xs font-light italic text-error -mt-3">
              *Rekening Anda
            </span>
            {dataBankSender.map((doc, index) => (
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
                          value={index}
                        />
                      </label>
                    </div>
                    <Image
                      src={`/payment/${doc.bank}.png`}
                      width={40}
                      height={40}
                      alt="bri"
                    />
                    <span className="flex flex-col uppercase">
                      <span className="text-slate-500 text-sm">
                        {doc.bank} - {doc.name}
                      </span>
                      <span>{doc.noRek}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-2 mt-2">
            <span>Penerima</span>
            <span className="text-xs font-light italic text-error -mt-3">
              *Rekening Tujuan
            </span>
            {dataBankRecipient.map((doc, index) => (
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
                          value={index}
                        />
                      </label>
                    </div>
                    <Image
                      src={`/payment/${doc.bank}.png`}
                      width={40}
                      height={40}
                      alt="bri"
                    />
                    <span className="flex flex-col uppercase">
                      <span className="text-slate-500 text-sm">
                        {doc.bank} - {doc.name}
                      </span>
                      <span>{doc.noRek}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-action flex justify-between">
            <Link className="btn btn-info" href={"/"}>
              <IoMdArrowRoundBack size={20} />
              <span>Back</span>
            </Link>
            <ButtonSendDeposit />
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
