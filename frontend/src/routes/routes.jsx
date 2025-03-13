import { createBrowserRouter } from "react-router-dom";
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import Home from "../pages/Home/Home"
import Issue from "../pages/Issue/Issue"
import Verify from "../pages/Verify/Verify"
import About from "../pages/About/About";
import WebAuth from "../pages/WebAuth/WebAuth";

const routes = [
    {
        path: "/",
        element: (
            <>
                <Header />
                <Home />
                <Footer />
            </>
        )
    },
    {
        path: "/issue",
        Component: Issue,
    },
    {
        path: "/verify",
        Component: Verify,
    },
    {
        path: "/about",
        Component: About,
    },
    {
        path: "/webauth",
        Component: WebAuth,
    }
];

export const router = createBrowserRouter(routes);
