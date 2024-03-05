import Navbar from "@/app/components/navbar";
import PageRouteSecure from "@/app/components/pageRouteSecure";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";

export default async function Dashboard() {
  return (
    <PageRouteSecure>
      <Navbar />
      <div className="p-4">
        <div className="md:px-8 card bg-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="md:text-3xl text-2xl font-medium mb-1 text-slate-300">
                  Rizfan
                </span>
                <span className="text-xs font-light -mb-1 md:text-base">
                  Total Deposit
                </span>
                <span className="md:text-4xl text-2xl font-semibold text-slate-300">
                  Rp. 100.000,-
                </span>
              </div>

              <Link
                href={"/addNewDeposito"}
                className="text-green-500 hover:text-green-600 transition cursor-pointer text-5xl"
              >
                <FaPlusCircle />
              </Link>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </PageRouteSecure>
  );
}
