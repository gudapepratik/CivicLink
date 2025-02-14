import { RiErrorWarningLine } from "@remixicon/react";
import React from "react";
import { NavLink } from "react-router";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    // console.error(error);

    return (
        <div className="w-full flex font-outfit justify-center text-zinc-800 selection:bg-rose-500 selection:text-white">
            <div className="text-center mt-32 flex items-center flex-col gap-2">
                <RiErrorWarningLine size={90} className="text-rose-500"/>
                <h1 className="text-2xl font-bold">404 - Not Found</h1>
                <p className="text-sm">Sorry, the page you are looking for does not exist.</p>
                <NavLink to={'/'} className="text-blue-600">Go back to Home</NavLink>
            </div>
        </div>
    );
};

export default ErrorPage