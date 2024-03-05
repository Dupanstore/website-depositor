"use client";
import { useFormStatus } from "react-dom";
import { IoIosSend } from "react-icons/io";

export default function ButtonSendDeposit() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn ${pending ? "btn-disabled" : "btn-success"}`}
      aria-disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      <IoIosSend size={20} />
      <span>Send</span>
    </button>
  );
}
