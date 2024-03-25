import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface realtimeCountdownProps {
    setDeposit: React.Dispatch<React.SetStateAction<number>>;
    deposit: number;
    session: number;
}

interface RealtimeDepositReturn {
    totalInitialDeposit: number;
}

const useRealtimeDeposit = ({ setDeposit, deposit, session }: realtimeCountdownProps): RealtimeDepositReturn => {
    const [totalInitialDeposit, setTotalInitialDeposit] = useState<number>(0);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`/api/getDeposit`);

            setDeposit(data.result); // Use functional update form of setDeposit
            if (totalInitialDeposit === 0) setTotalInitialDeposit(data.result);
        } catch (error) {
            console.log(error);
            setDeposit(0);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchData, 2000);

        return () => clearInterval(intervalId);
    }, [session, deposit, totalInitialDeposit]);

    return { totalInitialDeposit }
}


export default useRealtimeDeposit
