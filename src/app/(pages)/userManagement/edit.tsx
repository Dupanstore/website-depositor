import { FaEdit, FaMoneyBillWave, FaUserAlt } from "react-icons/fa";
import prisma from "@/utils/db";
import ButtonForm from "@/app/components/button";
import { IoIosSend } from "react-icons/io";
import { redirect } from "next/navigation";
import { isEmail } from "validator";
import { MdEmail } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

export default async function EditUser({ id }: { id: number }) {
  const userInfo = await prisma.user.findUnique({ where: { id } });

  async function onSubmit(formData: FormData) {
    "use server";
    const username: any = formData.get("username");
    const role: any = formData.get("role");
    const email: any = formData.get("email");
    const maxWin: any = formData.get("maxWin");
    const validateEmail = isEmail(email);

    async function handleSubmit() {
      if (validateEmail) {
        try {
          const response = await prisma.user.update({
            data: {
              username,
              email,
              role: role.toLowerCase(),
              maxWin: parseInt(maxWin),
            },
            where: { id },
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
      redirect("/userManagement");
    } else {
      redirect("/errorEditUserDataNotValid");
    }
  }

  return (
    <>
      <label htmlFor={`edit${id.toString()}`} className="cursor-pointer">
        <FaEdit className="text-info" size={30} />
      </label>

      <input
        type="checkbox"
        id={`edit${id.toString()}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-8">Edit User</h3>

          <form className="text-start grid gap-4" action={onSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <div className="flex items-center justify-between input input-bordered">
                <input
                  name="username"
                  id="username"
                  className="w-full"
                  required
                  defaultValue={userInfo?.username}
                />
                <FaUserAlt size={"1.5em"} className="text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <div className="flex items-center justify-between input input-bordered">
                <input
                  name="email"
                  id="email"
                  className="w-full"
                  required
                  defaultValue={userInfo?.email}
                />
                <MdEmail size={"1.5em"} className="text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="maxWin">Max Win (%)</label>
              <div className="flex items-center justify-between input input-bordered">
                <input
                  name="maxWin"
                  id="maxWin"
                  className="w-full"
                  required
                  type="number"
                  defaultValue={userInfo?.maxWin}
                />
                <FaMoneyBillWave size={"1.5em"} className="text-slate-500" />
              </div>
            </div>

            <div>
              <label htmlFor="role">Role</label>
              <div className="flex items-center justify-between input input-bordered">
                <select
                  id="role"
                  name="role"
                  className="w-full cursor-pointer bg-base-100"
                  required
                >
                  <option value={userInfo?.role} className="uppercase">
                    {userInfo?.role.toUpperCase()}
                  </option>
                  <option value={"user"}>USER</option>
                  <option value={"admin"}>ADMIN</option>
                </select>
                <RiAdminFill size={"1.5em"} className="text-slate-500" />
              </div>
            </div>

            <div className="modal-action">
              <label
                className="cursor-pointer btn btn-warning"
                htmlFor={`edit${id.toString()}`}
              >
                Close
              </label>
              <ButtonForm text="Send" icon={<IoIosSend size={20} />} />
            </div>
          </form>
        </div>

        <label
          className="modal-backdrop cursor-pointer"
          htmlFor={`edit${id.toString()}`}
        ></label>
      </div>
    </>
  );
}
