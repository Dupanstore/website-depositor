"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaPowerOff } from "react-icons/fa6";

export default function Logout() {
 
  const router = useRouter();
  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() => (
        signOut({ redirect: false }),
        router.push("/login"),
        setTimeout(() => window.location.reload(), 1000)
      )}
    >
      <div className="flex items-center gap-3">
        <div className="bg-error text-base-100 p-3 rounded-xl">
          <FaPowerOff size={25} />
        </div>
        <p className="text-error">Keluar</p>
      </div>
      <div className="text-error font-bold text-lg">{">"}</div>
    </div>
  );
}
