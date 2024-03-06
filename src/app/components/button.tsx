"use client";
import { useFormStatus } from "react-dom";
import { IoIosSend } from "react-icons/io";

export default function ButtonForm({
  colors,
  text,
  icon,
}: {
  colors?: string;
  text: string;
  icon: any;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`btn ${
        pending ? "btn-disabled" : colors ? colors : "btn-success"
      }`}
      aria-disabled={pending}
    >
      {pending && <span className="loading loading-spinner"></span>}
      {icon}
      <span>{text}</span>
    </button>
  );
}
