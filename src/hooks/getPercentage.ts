import axios from "axios";
import { useEffect } from "react";

interface PercentageProps {
    setPercentage: React.Dispatch<React.SetStateAction<number>>;
}

export const usePercentage = ({ setPercentage }: PercentageProps) => {
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/api/getPercentage`);

                setPercentage(data?.response?.value || 0);
            } catch (error) {
                console.log(error);
                setPercentage(0);
            }
        })()
    }, []);
}