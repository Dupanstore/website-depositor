import Link from "next/link";
import Logout from "./logout";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between bg-base-300 py-4 px-4 md:px-8">
      <Link href={"/"} className="font-semibold text-2xl">
        DEPOSITOR
      </Link>
      <Logout size="btn-sm" />
    </div>
  );
}
