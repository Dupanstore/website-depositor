"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout({ size = "" }: { size?: string }) {
  const router = useRouter();
  return (
    <div
      className={`cursor-pointer btn btn-error text-white ${size}`}
      onClick={() => (
        signOut({ redirect: false }),
        router.push("/login"),
        setTimeout(() => window.location.reload(), 500)
      )}
    >
      LOGOUT
    </div>
  );
}
