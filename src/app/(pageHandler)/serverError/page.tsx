"use client";
import { useRouter } from "next/navigation";
import { VscError } from "react-icons/vsc";

export default function RegisterDataNotValid() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Riddles - Server Error 404</title>

      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <VscError size={100} className="text-error" />
          <h1 className="text-4xl font-semibold">Server Error 404</h1>
          <div
            className="btn btn-primary text-white text-lg"
            onClick={() => router.back()}
          >
            OK
          </div>
        </div>
      </div>
    </div>
  );
}
