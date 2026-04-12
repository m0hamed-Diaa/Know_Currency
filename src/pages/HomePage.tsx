import { useEffect, useState } from "react";
import currencyCodes from "currency-codes";
import { type ExchangeRateResponse } from "../utils";
import { fetchRates } from "../API";
import Spinner from "../Spinner";



export const HomePage = () => {

    const [data, setData] = useState<ExchangeRateResponse | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EGP");
    const [result, setResult] = useState<number | null>(null);
    const [confirm, setConfirm] = useState<boolean>(false);

    const getCurrencyName = (code: string) => {
        return currencyCodes.code(code)?.currency || code;
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchRates();
                setData(data);
            } catch (err) {
                console.error(err);
            }
        };

        getData();
    }, []);
    const handleConvert = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!data) return;
        setConfirm(true);

        const rates = data?.conversion_rates;

        const converted =
            (amount / rates[from]) * rates[to];

        setConfirm(false);
        setResult(converted);
    };

    const currencies = data ? Object.keys(data.conversion_rates) : [];
    const isSuccess = data?.result === "success";

    return (
        <>
            <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 shadow-lg w-full space-y-4">

                <div className="flex items-center gap-3">

                    <span
                        className={`w-4 h-4 rounded-full ${isSuccess ? "bg-green-500 animate-pulse" : "bg-red-500 animate-ping"
                            }`}
                    />

                    <span className="font-semibold text-lg">
                        {isSuccess ? "Live Data Available" : "Data not available"}
                    </span>

                </div>

                {!data && (
                    <div className="text-yellow-400 animate-pulse">
                        Fetching latest data...
                    </div>
                )}

                <div className="bg-white/5 p-3 rounded-lg md:max-w-sm">
                    <p className="text-sm text-gray-400">🕒 Last Update</p>
                    <p className="font-medium">
                        {new Date(String(data?.time_last_update_utc)).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg md:max-w-sm">
                    <p className="text-sm text-gray-400">⏳ Next Update</p>
                    <p className="font-medium">
                        {new Date(String(data?.time_next_update_utc)).toLocaleString()}
                    </p>
                </div>
            </div>
            <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">

                <div className="container max-w-4xl mx-4 md:mx-auto grid md:grid-cols-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">

                    {/* 🖼️ Image Section */}
                    <div className="block">
                        <img
                            src="https://images.unsplash.com/photo-1604594849809-dfedbc827105"
                            alt="currency"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* 📄 Form Section */}
                    <div className="p-8 text-white space-y-6">
                        <h1 className="text-3xl font-bold text-center text-emerald-400">
                            💱 Know your currency equel to...
                        </h1>

                        <form className="space-y-4" onSubmit={handleConvert}>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount" className="block mb-1 text-sm">
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    required
                                    placeholder="Enter amount..."
                                    className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400"
                                />
                            </div>

                            {/* Current Currency */}
                            <div>
                                <label className="block mb-1 text-sm">
                                    Current Currency
                                </label>
                                <input
                                    list="currentCurrency"
                                    required
                                    placeholder="Search or enter..."
                                    className={`${currencies ? `` : `pointer-events-none`} w-full px-3 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400`}
                                    onChange={(e) => setFrom(e.target.value)}
                                    value={currencies ? "" : "Not data found"}
                                />
                                <datalist id="currentCurrency">
                                    {currencies?.map((cur) => (
                                        <option key={cur} value={cur} label={getCurrencyName(cur)} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Converted Currency */}
                            <div>
                                <label className="block mb-1 text-sm">
                                    Converted Currency
                                </label>
                                <input
                                    list="convertedCurrency"
                                    required
                                    placeholder="Search or enter..."
                                    className={`w-full px-3 py-2 rounded-lg ${currencies ? `` : `pointer-events-none`} bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400`}
                                    onChange={(e) => setTo(e.target.value)}
                                    value={currencies ? "" : "Not data found"}
                                />
                                <datalist id="convertedCurrency">
                                    {currencies?.map((cur) => (
                                        <option key={cur} value={cur} label={getCurrencyName(cur)} />
                                    ))}


                                </datalist>
                            </div>

                            {/* Button */}
                            <div className="flex items-center space-x-2">
                                <button
                                    type="submit"
                                    className={`w-full flex ${confirm ? `cursor-not-allowed` : `cursor-pointer`} items-center justify-center mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 duration-300 transition rounded-lg font-semibold`}
                                >
                                    {confirm ? <Spinner /> : "Convert"}
                                </button>
                                <button
                                    type="reset"
                                    className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 duration-300 cursor-pointer transition rounded-lg font-semibold"
                                    onClick={() => setResult(null)}
                                >
                                    Reset values
                                </button>
                            </div>

                            {result && (
                                <div>
                                    {amount} {from} = {result.toFixed(2)} {to}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
