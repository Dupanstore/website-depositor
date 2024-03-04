"use client";
import { useFormStatus } from "react-dom";
import { IoIosSend } from "react-icons/io";

export default function ButtonSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn btn-success ${pending && "btn-disabled btn-square"}`}
      aria-disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      {!pending && (
        <>
          <IoIosSend size={20} />
          Submit
        </>
      )}
    </button>
  );
}
