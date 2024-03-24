/* eslint-disable react-hooks/exhaustive-deps */
"use client";
 
import { useEffect,   useState } from "react";
 import axios from "axios";
import Swal from "sweetalert2";

export default function Bang({
  session,
 
 }: {
  session: number;
 
 }) {
  const [customValue, setCustomValue] = useState<number>(0);


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

  const submitCustomValue = async () => {
    try {
      const { data } = await axios.post(`/api/postBang`, {
        session,
        value: customValue,
      });

      Swal.fire({
        icon: 'success',
        title: 'Submit berhasil!',
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
      console.log('data', data);
      setCustomValue(data?.response?.bang || 0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Plase try again",
        allowOutsideClick: false,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  return (
    <>
      {/* <div className="flex items-center text-xl text-white justify-center">
        <span className="bg-black py-2 px-6 font-semibold rounded-xl flex items-center justify-center gap-2">
          <span className="rounded-full bg-red-500 p-1 text-sm">Rp</span>
          {buttonPlay
            ? saldoRealtime.toLocaleString("id-ID")
            : deposit.toLocaleString("id-ID")}
          ,-
        </span>
      </div> */}
     <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
        <div className="flex items-center mb-4">
          <input
            type="number"
            value={customValue}
            onChange={(e) => setCustomValue(parseInt(e.target?.value || ''))}
            placeholder="Masukkan nilai customValue"
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-gray-900"
          />
          <button
            onClick={submitCustomValue}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-red-900 focus:outline-none"
          >
            Submit
          </button>
        </div>
        {/* Tampilkan nilai customValue */}
        <p className="text-center text-gray-600">Max Bang : {customValue}</p>
      </div>
    </div>
 

    </>
  );
}
