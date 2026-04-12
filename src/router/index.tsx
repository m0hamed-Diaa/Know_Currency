import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import PageNotFound from "../pages/PageNotFound";
import UserErrorHandler from "../errors/errorHandler";
import { HomePage } from "../pages/HomePage";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route
                path="/"
                element={
                    <HomePage />
                }
                errorElement={<UserErrorHandler />}
            />

            <Route path="*" element={<PageNotFound />} />
        </>
    )
);

export default router;
