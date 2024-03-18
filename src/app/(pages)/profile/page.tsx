import MainLayout from "@/app/components/mainLayout";
import Title from "@/app/components/title";
import prisma from "@/utils/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { isEmail } from "validator";

export default async function Profile() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.name },
  });

  async function onSubmit(formData: FormData) {
    "use server";
    const email: any = formData.get("email");
    const password: any = formData.get("password");
    const hashPassword = await hash(password, 10);
    const validateEmail = isEmail(email);

    async function handleSubmit() {
      if (validateEmail) {
        try {
          const response = await prisma.user.update({
            data: {
              email,
              password: hashPassword,
            },
            where: { id: session.user.name },
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
      redirect("/updateProfileSuccess");
    } else if (result.message === "datanotvalid") {
      redirect("/errorRegisterDataNotValid");
    } else {
      redirect("/errorUserAlreadyExist");
    }
  }

  return (
    <MainLayout>
      <title>Riddles - Profile</title>
      <Title text="Profile" />
      <div className="max-w-md m-auto">
        <h1 className="text-center font-semibold mb-8 text-xl">My Profile</h1>
        <form className="flex flex-col gap-4" action={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              name="email"
              className="input input-bordered w-full"
              defaultValue={userData?.email}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              name="password"
              className="input input-bordered w-full"
            />
          </div>

          <button className="btn btn-success mt-4">Send</button>
        </form>
      </div>
    </MainLayout>
  );
}
