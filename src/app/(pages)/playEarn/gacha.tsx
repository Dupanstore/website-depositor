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
import axios from "axios";
import Swal from "sweetalert2";
 
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
interface UserRole {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  email: string;
  role: string;
  maxWin: number;
}

export default function Gacha({
  session,
  totalBetting,
  speed,
  roleUser,
}: {
  session: number;
  totalBetting: number;
  speed: number;
  roleUser: UserRole; // Menggunakan antarmuka UserRole di sini
}) {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [saldoRealtime, setSaldoRealtime] = useState(0);
  const [buttonPlay, setButtonPlay] = useState(false);
  const [buttonStop, setButtonStop] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [button, setButton] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [cashout, setCashout] = useState(0);
  const intervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const [cashoutClicked, setCashoutClicked] = useState(false);
  const [customValue, setCustomValue] = useState<number>(0);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        window.location.href = '/'; // Redirect ke halaman tujuan
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // if (typeof window !== "undefined") {
    //   const storedCustomValue = localStorage.getItem("customValue");
    //   if (storedCustomValue) {
    //     setCustomValue(parseInt(storedCustomValue, 10));
    //   }
    // }

    (async () => {
      try {
        const { data } = await axios.get(`/api/getBang`);
        console.log(data)
        setCustomValue(data?.response?.bang || 0);
      } catch (error) {
        console.log(error);
        setCustomValue(0);
      }
    })()


  }, []);


  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/getDeposit`);
        setDeposit(data.result);
      } catch (error) {
        console.log(error);
        setDeposit(0);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/getDeposit`);
        setDeposit(data.result);
      } catch (error) {
        console.log(error);
        setDeposit(0);
      }
    };

    const intervalId = setInterval(fetchData, 2500);
    return () => clearInterval(intervalId);
  }, [session]);

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

  const data = {
    labels:
      dataPoints.length > 0
        ? Array.from({ length: dataPoints.length }, (_, i) => i + 1)
        : [],
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
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false // Menonaktifkan gridlines pada sumbu X
        }
      },
      y: {
        grid: {
          display: false // Menonaktifkan gridlines pada sumbu Y
        }
      }
    }
  };


  async function getServerTime() {
    try {
      const { data } = await axios.get("/api/getServerTime");
      return data.time;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function startGacha() {
    if (deposit < speed) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Participant Balance tidak cukup. Balance saat ini Rp ${deposit.toLocaleString(
          "id-ID"
        )},-`,
        allowOutsideClick: false,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setCashout(0);
      const randomSeconds = Math.floor(Math.random() * customValue) + 1;
      const currentTime = await getServerTime();
      setStartTime(currentTime);
      setDataPoints([]);
      setButtonPlay(true);

      console.log(randomSeconds)
      timeoutRef.current = setTimeout(async () => {
        const currentTimePlay = await getServerTime();
        const elapsedTime = Math.floor((currentTimePlay - currentTime) / 1000);
        setCashout(0);
        setButtonPlay(false);
        setButtonStop(true);
        setButton(true);
        try {
          const addResult = await axios.post(`/api/addBetting`, {
            session,
            time: elapsedTime,
            nominal: speed * elapsedTime,
            status: "lose",
            speed,
          });
          Swal.fire({
            icon: "warning",
            title: "Coba lagi",
            text: `Anda Kalah dalam taruhan coba lagi, Rp -${speed * elapsedTime
              },-`,
            allowOutsideClick: false,
            timer: 2000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          setButton(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Server Error 404",
            allowOutsideClick: false,
            timer: 2000,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          setButton(false);
        }
      }, randomSeconds * 1000);
    }
  }


  async function handleCashout() {
    setCashoutClicked(true);
    setButtonStop(true);
    setButton(true);
   
    if (!buttonPlay) return;
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    const currentTime = await getServerTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    setCashout(speed * elapsedTime);
    setButtonPlay(false);
 
    if (deposit < speed * elapsedTime) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Participant Balance tidak cukup. Balance saat ini Rp ${deposit.toLocaleString(
          "id-ID"
        )},-`,
        allowOutsideClick: false,
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      try {
        const addResult = await axios.post(`/api/addBetting`, {
          session,
          time: elapsedTime,
          nominal: speed * elapsedTime,
          status: "win",
          speed,
        });
        Swal.fire({
          icon: "success",
          title: "Selamat",
          text: `Anda mendapatkan Rp ${speed * elapsedTime},-`,
          allowOutsideClick: false,
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Server Error 404",
          allowOutsideClick: false,
          timer: 2000,
          showConfirmButton: false,
        });
    
      }
    }
  
  }

  const startUpdatingChart = () => {
    intervalRef.current = setInterval(async () => {
      const currentTime = await getServerTime();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      const earnings = elapsedTime * speed;
      setDataPoints((prevDataPoints) => [...prevDataPoints, earnings]);
      setCurrentEarnings(earnings);
      setSaldoRealtime(deposit - earnings);
    }, 1000);
  };

  return (
    <>
    
  

      <div className="items-center justify-center text-black" style={{position:'absolute', top:'8%', left:'30%'}}>
        {buttonPlay && (
          <div className="bg-info p-2" style={{ background: "linear-gradient(to bottom, #ffffff 0%, yellow 100%)"}}>
            <p>You win : <span className="rounded-full bg-red-500 p-1 text-xs text-white">Rp</span> {currentEarnings}.0</p>
          </div>
        )}
      </div>
      {roleUser.role === 'admin' && ( // Cek apakah pengguna memiliki peran admin
      <div className="flex rounded-md items-center text-xs text-white justify-center bg-[#d7d7d7]">
        <span className="bg-black py-2 px-4 font-semibold rounded-xl flex items-center justify-center gap-2">
          <span className="rounded-full bg-red-500 p-2 text-sm">Rp</span>
          {buttonPlay
            ? saldoRealtime.toLocaleString("id-ID")
            : deposit.toLocaleString("id-ID")}
          ,-
        </span>
      </div> 
)}

      <div className="flex rounded-md items-center text-xs text-white justify-center bg-[#d7d7d7]">
        <span className="bg-green py-2 px-4 rounded-xl flex items-center justify-center">
          <span className="rounded-full bg-red-500 p-2 text-xs"></span>
          <span className="pl-1 text-gray-500 flex flex-col">
            87428
            <span className="text-error">1.3x</span>
          </span>
        </span>
        <span className="py-2 px-4 rounded-xl flex items-center justify-center">
          <span className="rounded-full bg-green-500 p-2 text-xs"></span>
          <span className="pl-1 text-gray-500 flex flex-col">
            87428
            <span className="text-success">1.3x</span>
          </span>
        </span>
        <span className="py-2 px-4 rounded-xl flex items-center justify-center">
          <span className="rounded-full bg-green-500 p-2 text-xs"></span>
          <span className="pl-1 text-gray-500 flex flex-col">
            87428
            <span className="text-success">1.3x</span>
          </span>
        </span>
        <span className="py-2 px-4 rounded-xl flex items-center justify-center">
          <span className="rounded-full bg-red-500 p-2 text-xs"></span>
          <span className="pl-1 text-gray-500 flex flex-col">
            87428
            <span className="text-error">1.3x</span>
          </span>
        </span>
      </div>



      <Line data={data} options={options} className="max-h-96" />

      <div className="grid grid-cols-1 lg:grid-cols-4 items-center justify-center gap-4 m-auto text-center">
        <div className="flex flex-col items-center justify-center mb-4">
          <span className="bg-transparent text-transparent">
            Waiting for the next round
          </span>
          {button ? (
            <div className={`btn btn-disabled text-white w-full`}>RUNNING</div>
          ) : buttonPlay ? (
            buttonStop ? (
              <div className={`btn btn-disabled text-white w-full`}>STOP</div>
            ) : (
              <div
                onClick={handleCashout}
                className={`btn btn-warning text-white w-full flex flex-col`}
              >
                <span>Rp {currentEarnings.toLocaleString("id-ID")}</span>
                <span>Cashout</span>
              </div>
            )
          ) : deposit === 0 ? (
            <div className={`btn btn-disabled text-white w-full`}>RUNNING</div>
          ) : (
            <div
              onClick={startGacha}
              className={`btn btn-success text-white w-full`}
            >
              RUNNING
            </div>
          )}
        </div>

        {/* <div className="flex flex-col items-center justify-center">
          <span>Cashout</span>
          <div
            className={`h-12 border-2 rounded-lg w-full flex items-center justify-center`}
          >
            Rp {totalBetting.toLocaleString("id-ID")},-
          </div>
        </div> */}

        <div className="flex flex-col">
          <span>
            Cashout{" "}
            <span className="rounded-full border p-1 text-xs text-green-500">
              !
            </span>
          </span>
          <div
            className={`h-12 border-2 rounded-lg w-full flex items-center pl-4`}
          >
            <span className="rounded-full bg-red-500 p-1 text-xs text-white">
              Rp
            </span>{" "}
            {totalBetting.toLocaleString("id-ID")},-
          </div>
        </div>

        {/* <div className="flex flex-col items-center justify-center">
          <span>Speed</span>
          <div
            className={`h-12 border-2 rounded-lg w-full flex items-center justify-center`}
          >
            Rp {speed.toLocaleString("id-ID")},-
          </div>
        </div> */}

        <div className="flex flex-col">
          <span>Spend</span>
          <div
            className={`h-12 border-2 rounded-lg w-full flex items-center pl-4`}
          >
            <span className="rounded-full bg-red-500 p-1 text-xs text-white">
              Rp
            </span>{" "}
            {speed.toLocaleString("id-ID")},-
          </div>
        </div>
        {/* <div className="flex flex-col items-center justify-center">
          <span>Profit</span>
          <div
            className={`h-12 border-2 rounded-lg w-full flex items-center justify-center`}
          >
            Rp {currentEarnings},-
          </div>
        </div> */}

        <div className="flex flex-col items-center justify-center">
          <span>Riwayat</span>
          <label
            htmlFor="bettingHistory"
            className="btn btn-primary drawer-button w-full text-white"
          >
            History
          </label>
        </div>
      </div>

    </>
  );
}
