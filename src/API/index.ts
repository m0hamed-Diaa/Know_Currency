import type { ExchangeRateResponse } from "../utils";

export const fetchRates = async (): Promise<ExchangeRateResponse> => {
    const res = await fetch(
        "https://v6.exchangerate-api.com/v6/8a77d202b19b174be16dd3e6/latest/USD"
    );

    if (!res.ok) {
        throw new Error("Failed to fetch rates");
    }

    return res.json();
};