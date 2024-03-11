/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useRef, useState } from "react";
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
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [buttonPlay, setButtonPlay] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [cashout, setCashout] = useState(0);
  const [speed, setSpeed] = useState(0);
  const intervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const data = {
    labels: Array.from({ length: dataPoints.length }, (_, i) => i + 1),
    datasets: [
      {
        fill: true,
        label: "",
        data: dataPoints.map((value, index) => ({ x: index + 1, y: value })),
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

  useEffect(() => {
    if (buttonPlay) {
      startUpdatingChart();
    } else {
      clearInterval(intervalRef.current);
    }
  }, [buttonPlay]);

  useEffect(() => {
    if (cashout > 0) {
      clearInterval(intervalRef.current);
    }
  }, [cashout]);

  const startGacha = () => {
    setCashout(0);
    const randomSeconds = Math.floor(Math.random() * 60) + 1;
    setButtonPlay(true);
    setStartTime(Date.now());
    setDataPoints([]);
    timeoutRef.current = setTimeout(() => {
      setCashout(0);
      setButtonPlay(false);
    }, randomSeconds * 1000);
  };

  const startUpdatingChart = () => {
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setDataPoints((prevDataPoints) => [
        ...prevDataPoints,
        elapsedTime * speed,
      ]);
    }, 1000);
  };

  const handleCashout = () => {
    if (!buttonPlay) return;
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setCashout(speed * elapsedTime);
    setButtonPlay(false);
  };

  return (
    <>
      <Line data={data} options={options} className="my-4 max-h-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 max-w-3xl m-auto text-center">
        <div className="flex flex-col items-center justify-center">
          <span>Cashout</span>
          {buttonPlay ? (
            <div
              onClick={handleCashout}
              className={`btn hover:bg-slate-800 bg-slate-700 transition text-white w-full`}
            >
              Rp {cashout},-
            </div>
          ) : (
            <div
              className={`btn !bg-slate-400 btn-disabled !text-white w-full`}
            >
              Rp {cashout},-
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Speed</span>
          {buttonPlay ? (
            <div className="input input-disabled w-full flex items-center justify-center">
              {speed}
            </div>
          ) : (
            <input
              type="number"
              required
              className={`input w-full input-bordered`}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Waiting for the next round</span>
          {buttonPlay ? (
            <div
              className={`btn btn-disabled !bg-slate-400 !text-white w-full`}
            >
              WAITING
            </div>
          ) : (
            <div
              onClick={startGacha}
              className={`btn bg-slate-700 hover:bg-slate-800 transition text-white w-full`}
            >
              PLAY
            </div>
          )}
        </div>
      </div>
    </>
  );
}
