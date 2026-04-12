export interface ExchangeRateResponse {
    result: string;
    time_last_update_utc: string;
    time_next_update_utc: string;
    conversion_rates: Record<string, number>;
}
