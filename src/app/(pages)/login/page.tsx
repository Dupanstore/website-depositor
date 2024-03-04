import LoginRegisterRouteSecure from "@/app/components/loginRegisterRouteSecure";
import FormLogin from "./form";

export default function Login() {
  return (
    <LoginRegisterRouteSecure>
      <div className="w-screen h-screen justify-center items-center flex px-4">
        <div className="card w-full max-w-md bg-base-300">
          <div className="card-body">
            <div>
              <h1 className="text-3xl font-semibold text-center">LOGIN</h1>
              <FormLogin />
            </div>
          </div>
        </div>
      </div>
    </LoginRegisterRouteSecure>
  );
}
