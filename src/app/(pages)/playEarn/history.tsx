import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import HistoryControl from "./historyControl";

export default async function BettingHistory({
  children,
  bettingUser,
  bettingAllUser,
}: {
  children: ReactNode;
  bettingUser: any;
  bettingAllUser: any;
}) {
  return (
    <div className="drawer">
      <input id="bettingHistory" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>

      <div className="drawer-side z-20">
        <label
          htmlFor="bettingHistory"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu p-4 max-w-md w-full min-h-full bg-white text-black">
          <div className="flex justify-between mb-6 items-center">
            <div className="text-lg font-semibold">Riwayat</div>
            <label htmlFor="bettingHistory" className="cursor-pointer">
              <IoClose size={40} />
            </label>
          </div>

          <HistoryControl
            bettingUser={bettingUser}
            bettingAllUser={bettingAllUser}
          />
        </ul>
      </div>
    </div>
  );
}
