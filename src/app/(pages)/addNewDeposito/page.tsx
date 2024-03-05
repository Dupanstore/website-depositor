import Link from "next/link";
import ButtonSendDeposit from "./button";
import { IoMdArrowRoundBack } from "react-icons/io";
import Navbar from "@/app/components/navbar";

export default function AddNewDeposito() {
  async function onSubmit(formData: FormData) {
    "use server";
    const data = {
      sender_bank: formData.get("sender_bank"),
      recipient_bank: formData.get("recipient_bank"),
      nominal_deposit: formData.get("nominal_deposit"),
      proof_transaction: formData.get("proof_transaction"),
    };

    try {
      console.log(data);
      return { message: "success" };
    } catch (error) {
      return { message: "error", error };
    }
  }

  return (
    <div>
      <Navbar />
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-bold">Add New Deposit</h3>

          <form className="grid py-6 gap-4" action={onSubmit}>
            <input
              placeholder="Pengirim"
              name="sender_bank"
              required
              className="input input-bordered w-full"
            />

            <select
              className="select select-bordered w-full"
              required
              name="recipient_bank"
            >
              <option>Penerima</option>
              <option value={1}>BRI - 12334587435437 - ADMIN</option>
              <option value={2}>BCA - 12334587435437 - ADMIN</option>
            </select>

            <input
              placeholder="Nominal"
              name="nominal_deposit"
              required
              type="number"
              className="input input-bordered w-full"
            />

            <div className="file-input file-input-bordered w-full grid items-center px-4">
              <label htmlFor="files" className="cursor-pointer">
                Upload Bukti Transfer
              </label>

              <input
                type="file"
                id="files"
                className="hidden"
                required
                name="proof_transaction"
              />
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
      </div>
    </div>
  );
}
