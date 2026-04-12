import type { ExchangeRateResponse } from "../utils";

export const fetchRates = async (): Promise<ExchangeRateResponse> => {
    const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_API_KEY}/latest/USD`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch rates");
    }

    return res.json();
};
