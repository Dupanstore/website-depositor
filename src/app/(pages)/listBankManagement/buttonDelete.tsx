"use client";
import { useFormStatus } from "react-dom";
import { MdDelete } from "react-icons/md";

export default function ButtonDeleteBank() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn ${pending ? "btn-disabled" : "btn-error"}`}
      aria-disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      <MdDelete size={20} />
      <span>Delete</span>
    </button>
  );
}
