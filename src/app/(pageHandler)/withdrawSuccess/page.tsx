import Link from "next/link";
import { FaRegCheckCircle } from "react-icons/fa";

export default function WithdrawSuccess() {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Withdraw Success</title>

      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <FaRegCheckCircle size={100} className="text-success" />
          <h1 className="text-4xl font-semibold">Congratulations</h1>
          <p className="py-4 text-2xl">Withdraw Success</p>
          <p className="text-center">
            Penarikan dana sedang diproses oleh admin, mohon tunggu beberapa
            saat.
          </p>
          <Link
            href={"/withdraw"}
            className="btn btn-primary text-white text-lg"
          >
            OK
          </Link>
        </div>
      </div>
    </div>
  );
}
