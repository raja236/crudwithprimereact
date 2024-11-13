import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site') || "");
    const navigate = useNavigate();
    const loginAction = async (data) => {
        debugger;
        try {
            const response = await fetch("https://localhost:7095/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();
            if (res) {
                setUser(res.userName);
                setToken(res.token);
                localStorage.setItem("site", res.token);
                navigate("deshboard");
                return;
            }
        } catch (err){
            console.log(err);
        }

    };

    const logOut = () => {
        setUser("");
        setToken("");
        localStorage.removeItem("site");
        navigate("/");
    };

    return <AuthContext.Provider value={{ token, user, loginAction, logOut }}>{children}</AuthContext.Provider>
};
export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};