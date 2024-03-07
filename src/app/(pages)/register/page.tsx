import LoginRegisterRouteSecure from "@/app/components/loginRegisterRouteSecure";
import Link from "next/link";
import { FaKey, FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import bcrypt from "bcrypt";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { isEmail } from "validator";
import ButtonForm from "@/app/components/button";

export default function Register() {
  async function onSubmit(formData: FormData) {
    "use server";
    const username: any = formData.get("username");
    const email: any = formData.get("email");
    const password: any = formData.get("password");
    const hashPassword = await bcrypt.hash(password, 10);
    const validateEmail = isEmail(email);

    async function handleSubmit() {
      if (validateEmail) {
        try {
          const response = await prisma.user.create({
            data: {
              username,
              email,
              password: hashPassword,
              role: "user",
            },
          });
          return { message: "success", response };
        } catch (error) {
          return { message: "error", error };
        }
      } else {
        return { message: "datanotvalid" };
      }
    }

    const result = await handleSubmit();
    if (result.message === "success") {
      redirect("/login");
    } else if (result.message === "datanotvalid") {
      redirect("/errorRegisterDataNotValid");
    } else {
      redirect("/errorUserAlreadyExist");
    }
  }

  return (
    <LoginRegisterRouteSecure>
      <title>Depositor - Register</title>
      <div className="w-screen h-screen justify-center items-center flex px-4">
        <div className="card w-full max-w-sm bg-base-300">
          <div className="card-body">
            <h1 className="text-3xl font-semibold text-center">REGISTER</h1>

            <form
              className="text-start w-full mt-8 flex flex-col gap-4"
              action={onSubmit}
            >
              <div className="flex items-center justify-between input bg-transparent border-b border-b-slate-500">
                <input
                  placeholder="Username"
                  className="w-full"
                  required
                  name="username"
                />
                <FaUserAlt size={"1.5em"} className="text-slate-500" />
              </div>

              <div className="flex items-center justify-between input bg-transparent border-b border-b-slate-500">
                <input
                  placeholder="Email"
                  className="w-full"
                  required
                  name="email"
                />
                <MdEmail size={"1.5em"} className="text-slate-500" />
              </div>

              <div className="flex items-center justify-between input bg-transparent border-b border-b-slate-500">
                <input
                  placeholder="Password"
                  type="password"
                  className="w-full"
                  required
                  name="password"
                />
                <FaKey size={"1.5em"} className="text-slate-500" />
              </div>

              <ButtonForm text="Register" />
            </form>

            <Link
              href={"/login"}
              className="mt-8 text-center font-semibold text-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </LoginRegisterRouteSecure>
  );
}
