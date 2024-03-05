import Link from "next/link";
import ButtonSendDeposit from "./button";
import { IoMdArrowRoundBack } from "react-icons/io";
import Navbar from "@/app/components/navbar";
import Image from "next/image";
import { redirect } from "next/navigation";
import prisma from "@/utils/db";
import { getServerSession } from "next-auth";

const dataBank = [
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bca", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bca", noRek: "24267453653435" },
  { name: "ADMIN", bank: "bri", noRek: "24267453653435" },
];

export default async function AddNewDeposito() {
  const session: any = await getServerSession();

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
          const response = await prisma.deposit.create({
            data: {
              nominal_deposit: parseInt(nominal_deposit),
              proof_transaction: proof_transaction.name,
              status: "submit",
              sender_bank,
              recipient_bank: parseInt(recipient_bank),
              author: { connect: { id: session.user.name } },
            },
            include: { author: true },
          });
          return { message: "success", response };
        } catch (error) {
          return { message: "error", error };
        }
      }
    }

    const result = await handleSubmit();
    console.log(result);
    if (result.message === "success") {
      redirect("/");
    } else if (result.message === "empty") {
      redirect("/errorAddNewDepositoDataCannotBeEmpty");
    } else {
      redirect("/errorAddDeposito");
    }
  }

  return (
    <>
      <title>Add New Deposit</title>
      <Navbar />
      <div className="p-4">
        <h3 className="text-lg font-bold">Add New Deposit</h3>

        <form className="grid py-6 gap-4" action={onSubmit}>
          <div>
            <label htmlFor="Pengirim">Pengirim</label>
            <input
              id="Pengirim"
              name="sender_bank"
              required
              className="input input-bordered w-full"
            />
          </div>

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

          <div className="grid grid-flow-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2">
            {dataBank.map((doc, index) => (
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

          <div className="modal-action">
            <Link className="btn btn-info" href={"/"}>
              <IoMdArrowRoundBack size={20} />
              <span>Back</span>
            </Link>
            <ButtonSendDeposit />
          </div>
        </form>
      </div>
    </>
  );
}
