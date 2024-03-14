import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import Image from "next/image";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

export default async function BettingHistory({
  children,
  betting,
}: {
  children: ReactNode;
  betting: any;
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

          <div>
            {betting.map((doc: any) => (
              <div className="flex items-center gap-2" key={doc.id}>
                <Image
                  src={"/logoHistoryBet.png"}
                  alt="logo"
                  width={65}
                  height={65}
                />

                <div className="flex justify-between w-full">
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold">Crash FIAT 85%</span>
                    <span className="flex gap-3 text-gray-500 font-light">
                      <span className="text-xs">
                        {formatTime(doc.createdAt)}
                      </span>
                      <span className="text-xs">
                        {formatDate(doc.createdAt)}
                      </span>
                    </span>
                  </div>

                  <div className="text-end flex flex-col gap-3">
                    {doc.status === "win" ? (
                      <span className="text-success font-semibold">
                        +Rp{doc.nominal.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-error font-semibold">
                        -Rp{doc.nominal.toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className="text-xs font-light text-gray-500">
                      Rp{doc.speed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
