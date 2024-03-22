"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaKey, FaUserAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect } from "react";
 

type inputs = {
  username: string;
  password: string;
};

export default function FormLogin() {
  const { register, handleSubmit } = useForm<inputs>();
  const [buttonSubmit, setButtonSubmit] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: inputs) => {
    setButtonSubmit(true);
    try {
      const response = await signIn("credentials", {
        username: e.username,
        password: e.password,
        redirect: false,
      });
      if (response!.ok === false) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Username atau password yang anda masukkan salah",
          allowOutsideClick: false,
        });
      } else if (response!.ok === true) {
        router.push("/");
      }
      setButtonSubmit(false);
    } catch (error) {
      console.log(error);
      setButtonSubmit(false);
      Swal.fire({
        icon: "error",
        title: "Server Error 404",
        allowOutsideClick: false,
      });
    }
  };
   
  return (
    <form
      className="text-start w-full mt-8 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between input bg-transparent border-b border-b-slate-500">
        <input
          placeholder="Username"
          className="w-full"
          required
          {...register("username", { required: true })}
        />
        <FaUserAlt size={"1.5em"} className="text-slate-500" />
      </div>

      <div className="flex items-center justify-between input bg-transparent border-b border-b-slate-500">
        <input
          type="password"
          placeholder="Password"
          className="w-full"
          required
          {...register("password", { required: true })}
        />
        <FaKey size={"1.5em"} className="text-slate-500" />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-4">
        {buttonSubmit ? (
          <div className="btn btn-primary w-full">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <button className="btn btn-primary w-full">Login</button>
        )}
      </div>
    </form>
  );
}
