import MainLayout from "@/app/components/mainLayout";
import Link from "next/link";
import { IoIosSend, IoMdArrowRoundBack } from "react-icons/io";
import ButtonForm from "@/app/components/button";

export default async function AddNewPaymentMethod() {
  return (
    <MainLayout>
      <title>Depositor - Add New Payment Method</title>
      <div className="max-w-md m-auto">
        <h3 className="text-lg font-bold">Add New Payment Method</h3>

        <form className="grid py-6 gap-4">
          <div>
            <label htmlFor="input1">Atas Nama Rekening</label>
            <input
              id="input1"
              name="name"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="input2">Nomor Rekening</label>
            <input
              id="input2"
              name="no_rekening"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label htmlFor="select1">Bank</label>
            <select
              className="select select-bordered w-full"
              id="select2"
              name="bank"
              required
            >
              <option>BRI</option>
              <option>BRI</option>
              <option>BRI</option>
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
