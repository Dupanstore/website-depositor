"use client";
import { useFormStatus } from "react-dom";

export default function ButtonRegister() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn ${pending ? "btn-disabled" : "btn-primary"}`}
      aria-disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      Register
    </button>
  );
}
