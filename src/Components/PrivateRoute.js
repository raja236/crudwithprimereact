import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
    const user = useAuth();
    debugger
    if (!user.token) {
        return <Navigate to="/" replace />;
    }
    return <Outlet/>
    
};
export default PrivateRoute;