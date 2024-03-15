"use client";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import Image from "next/image";
import { useState } from "react";

export default function HistoryControl({ bettingUser, bettingAllUser }: any) {
  const [history, setHistory] = useState(false);

  return (
    <>
      <div className="mb-6 flex gap-6">
        <span
          onClick={() => setHistory(false)}
          className={`cursor-pointer ${
            history ? "" : "font-semibold text-info"
          }`}
        >
          My History
        </span>
        <span
          onClick={() => setHistory(true)}
          className={`cursor-pointer ${
            history ? "font-semibold text-info" : ""
          }`}
        >
          All User
        </span>
      </div>

      {history
        ? bettingAllUser.map((doc: any) => (
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
                    <span className="text-xs">{formatTime(doc.createdAt)}</span>
                    <span className="text-xs">{formatDate(doc.createdAt)}</span>
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
          ))
        : bettingUser.map((doc: any) => (
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
                    <span className="text-xs">{formatTime(doc.createdAt)}</span>
                    <span className="text-xs">{formatDate(doc.createdAt)}</span>
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
    </>
  );
}
