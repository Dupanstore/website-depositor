import LoginRegisterRouteSecure from "@/app/components/loginRegisterRouteSecure";
import FormLogin from "./form";
import Link from "next/link";
import Title from "@/app/components/title";

export default function Login() {
  return (
    <LoginRegisterRouteSecure>
      <Title text="Login" />
      <div className="w-screen h-screen justify-center items-center flex px-4 bg-slate-300">
        <div className="card w-full max-w-sm bg-white shadow-lg">
          <div className="card-body">
            <h1 className="text-3xl font-semibold text-center">LOGIN</h1>
            <FormLogin />
            <Link
              href={"/register"}
              className="mt-8 text-center font-semibold text-primary"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </LoginRegisterRouteSecure>
  );
}
