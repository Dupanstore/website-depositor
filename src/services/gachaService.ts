import axios from "axios";
import { MutableRefObject, useEffect } from "react"
import Swal from "sweetalert2";

export async function getServerTime() {
    try {
        const { data } = await axios.get("/api/getServerTime");
        return data.time;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const depositCheckerToStopGacha = async (
    session: number,
    speed: number,
    intervalRef: MutableRefObject<any>,
    timeoutRef: MutableRefObject<any>,
    deposit: number,
    totalInitialDeposit: number,
    startTime: number,
    setCashout: React.Dispatch<React.SetStateAction<number>>,
    setButtonPlay: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonStop: React.Dispatch<React.SetStateAction<boolean>>,
    setButton: React.Dispatch<React.SetStateAction<boolean>>,
    percentage: number
) => {
    const valPercentage = totalInitialDeposit * percentage; // real
    // const oneThousandthOfPercent = totalInitialDeposit * 0.00001; // for testing

    const totalReduction = totalInitialDeposit - deposit;

    if (totalReduction >= valPercentage) {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);

        const currentTimePlay = await getServerTime();
        const elapsedTime = Math.floor((currentTimePlay - startTime) / 100);

        setCashout(0);
        setButtonPlay(false);
        setButtonStop(true);
        setButton(true);

        try {
            const addResult = await axios.post(`/api/addBetting`, {
                session,
                time: elapsedTime,
                nominal: 0,
                status: "lose",
                speed,
            });

            Swal.fire({
                icon: "warning",
                title: "Coba lagi",
                text: `Anda Kalah dalam taruhan coba lagi, Rp -${speed
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
    }
}