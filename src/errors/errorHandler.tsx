import { Link, useNavigate } from "react-router-dom";
interface IProps {
    statusCode?: number;
    title?: string;
}

const UserErrorHandler = ({ statusCode = 500, title = "Server Error" }: IProps) => {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex items-center justify-center w-screen h-screen bg-linear-to-br from-slate-900 to-slate-800">
                <div className="text-center space-y-2">
                    <div className="inline-flex rounded-full bg-red-100 p-4">
                        <div className="rounded-full stroke-red-600 bg-red-200 p-4">
                            <svg
                                className="w-16 h-16"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 8H6.01M6 16H6.01M6 12H18C20.2091 12 22 10.2091 22 8C22 5.79086 20.2091 4 18 4H6C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12ZM6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20H14"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                                <path
                                    d="M17 16L22 21M22 16L17 21"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl text-white">
                        {statusCode} - {title}
                    </h2>
                    <h3 className="text-lg">
                        Oops something went wrong. Try to refresh this page or
                        <br />
                        feel free to contact us if the problem presists.
                    </h3>
                    <div
                        style={{ marginTop: "5px" }}
                        className="flex items-center justify-center gap-4 space-x-4 my-10"
                    >
                        <button
                            className="text-white cursor-pointer bg-emerald-500 hover:bg-emerald-600 p-2 rounded-lg mt-2"
                        >
                            <Link
                                to={"/"}
                            >
                                Go home
                            </Link>
                        </button>
                        <button
                            className="text-white cursor-pointer bg-emerald-500 hover:bg-emerald-600 p-2 rounded-lg mt-2"
                            onClick={() => navigate(0)}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserErrorHandler;
