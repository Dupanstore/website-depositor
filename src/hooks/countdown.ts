import { useEffect, useState } from "react";

interface CountdownProps {
    startCountdown: boolean;
    startGacha: () => void;
    setStartCountdown: React.Dispatch<React.SetStateAction<boolean>>;
    setButton: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCountdown = ({ startCountdown, startGacha, setStartCountdown, setButton }: CountdownProps): number => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer: any;
        if (countdown == 0) setStartCountdown(false);
        if (startCountdown) {
            timer = setTimeout(() => {
                if (countdown == 1) {
                    setButton(false)
                    startGacha()
                };


                if (countdown > 0) {
                    setCountdown(prevCount => prevCount - 1);
                }

            }, 1000);
        }

        // Clear the timeout when component unmounts or when count reaches 0
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [countdown, startCountdown]);

    return countdown;
}