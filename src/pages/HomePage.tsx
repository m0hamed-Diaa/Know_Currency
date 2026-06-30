import { useEffect, useState } from "react";
import { type ExchangeRateResponse } from "../utils";
import { fetchRates } from "../API";
import Spinner from "../Spinner";
import { useTranslation } from "react-i18next";
import i18n from "../lib/i18";


export const HomePage = () => {
    const { t } = useTranslation();

    const [data, setData] = useState<ExchangeRateResponse | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EGP");
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [locale, setLocale] = useState<"en" | "ar">(() => {
        return (localStorage.getItem("locale") as "en" | "ar") || "en";
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchRates();
                setData(data);
                setLoading(false)
            } catch (err) {
                console.error(err);
            }
        };

        localStorage.setItem("locale", locale);
        i18n.changeLanguage(locale);
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

        getData();
    }, [locale]);
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

    const getCurrencyName = (code: string, locale: "en" | "ar") => {
        const displayNames = new Intl.DisplayNames([locale], {
            type: "currency",
        });

        return displayNames.of(code) || code;
    };

    const currencies = data ? Object.keys(data.conversion_rates) : [];
    const isSuccess = data?.result === "success";

    return (
        <>
            <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white p-6 shadow-lg w-full space-y-4">

                {/* Langauge Button */}
                <button
                    onClick={() =>
                        setLocale((prev) => (prev === "en" ? "ar" : "en"))
                    }
                    className="px-4 py-2 rounded-lg bg-emerald-500 cursor-pointer"
                >
                    {t("language")}
                </button>

                <div className="flex items-center gap-3">

                    <span
                        className={`w-4 h-4 rounded-full ${isSuccess ? "bg-green-500 animate-pulse" : "bg-red-500 animate-ping"
                            }`}
                    />

                    <span className="font-semibold text-lg">
                        {isSuccess
                            ? t("liveDataAvailable")
                            : t("dataNotAvailable")}
                    </span>

                </div>

                {!data && (
                    <div className="text-yellow-400 animate-pulse">
                        {t("fetchingLatestData")}
                    </div>
                )}

                <div className="bg-white/5 p-3 rounded-lg md:max-w-sm">
                    <p className="text-sm text-gray-400">
                        🕒 {t("lastUpdate")}
                    </p>
                    <p className="font-medium">
                        {new Date(String(data?.time_last_update_utc)).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg md:max-w-sm">
                    <p className="text-sm text-gray-400">
                        ⏳ {t("nextUpdate")}
                    </p>
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
                            💱 {t("title")}
                        </h1>

                        <form className="space-y-4" onSubmit={handleConvert}>

                            {/* Amount */}
                            <div>
                                <label htmlFor="amount">
                                    {t("amount")}
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder={t("enterAmount")}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    required
                                    className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400"
                                />
                            </div>

                            {/* Current Currency */}
                            <div>
                                <label>
                                    {t("fromCurrency")}
                                </label>
                                <input
                                    list="currentCurrency"
                                    required
                                    placeholder={t("searchCurrency")}
                                    className={`${currencies ? `` : `pointer-events-none`} w-full px-3 py-2 rounded-lg bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400`}
                                    onChange={(e) => setFrom(e.target.value)}
                                    value={loading ? t("loading") : from}
                                />
                                <datalist id="currentCurrency">
                                    {currencies?.length ? currencies?.map((cur) => (
                                        <option key={cur} value={cur} label={getCurrencyName(cur, locale)} />
                                    )) : <option>
                                        {t("noCurrencies")}
                                    </option>}
                                </datalist>
                            </div>

                            {/* Converted Currency */}
                            <div>
                                <label>
                                    {t("toCurrency")}
                                </label>
                                <input
                                    list="convertedCurrency"
                                    required
                                    placeholder={t("searchCurrency")}
                                    className={`w-full px-3 py-2 rounded-lg ${currencies ? `` : `pointer-events-none`} bg-white/20 border border-white/20 focus:outline-none duration-300 focus:border-dashed focus:border-2 focus:border-emerald-400`}
                                    onChange={(e) => setTo(e.target.value)}
                                    value={loading ? t("loading") : to}
                                />
                                <datalist id="convertedCurrency">
                                    {currencies?.length ? currencies?.map((cur) => (
                                        <option key={cur} value={cur} label={getCurrencyName(cur, locale)} />
                                    )) : <option>
                                        {t("noCurrencies")}
                                    </option>}
                                </datalist>
                            </div>

                            {/* Button */}
                            <div className="flex items-center space-x-2">
                                <button
                                    type="submit"
                                    className={`w-full flex ${confirm ? `cursor-not-allowed` : `cursor-pointer`} items-center justify-center mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 duration-300 transition rounded-lg font-semibold`}
                                >
                                    {confirm ? <Spinner /> : t("convert")}
                                </button>
                                <button
                                    type="reset"
                                    className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 duration-300 cursor-pointer transition rounded-lg font-semibold"
                                    onClick={() => setResult(null)}
                                >
                                    {t("reset")}
                                </button>
                            </div>

                            {result && (
                                <div className="bg-emerald-500/20 p-4 rounded-lg text-center">
                                    <p className="font-semibold">
                                        {t("conversionResult")}
                                    </p>

                                    <p className="mt-2 text-lg">
                                        {amount} {from} = {result.toFixed(2)} {to}
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>
            <footer className="py-6 text-center text-sm text-gray-400 bg-linear-to-br from-slate-900 to-slate-800">
                {t("madeBy")}{" "}
                <span className="font-bold text-emerald-400 underline relative inline-block cursor-default after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full">
                    Mohamed Diaa
                </span>
            </footer>
        </>
    )
}
