"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useForm } from "react-hook-form";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Gacha({ saldo }: { saldo: number }) {
  const [buttonPlay, setButtonPlay] = useState(false);
  const { register, handleSubmit } = useForm();
  const [cashout, setCashout] = useState(0);

  const labels = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "",
        data: [
          5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
          95, 100, 140,
        ],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  function onSubmit(e: any) {
    setButtonPlay(true);
    const randomSeconds = Math.floor(Math.random() * 60) + 1;
    setTimeout(() => {
      setCashout(e.speed * randomSeconds);
      setButtonPlay(false);
    }, randomSeconds * 1000);
  }

  return (
    <>
      <Line data={data} options={options} className="my-4 max-h-80" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 max-w-3xl m-auto text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <span>Cashout</span>
          <span className="text-white bg-slate-600 rounded-lg w-full py-2">
            Rp {cashout},-
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Speed</span>
          <input
            type="number"
            required
            className="input input-bordered w-full"
            {...register("speed", { required: true })}
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Waiting for the next round</span>
          <button
            disabled={buttonPlay}
            className={`btn ${
              buttonPlay ? "bg-gray-400 cursor-not-allowed" : "bg-slate-700"
            } hover:bg-slate-800 transition text-white w-full`}
          >
            {buttonPlay ? "WAITING..." : "PLAY"}
          </button>
        </div>
      </form>
    </>
  );
}
