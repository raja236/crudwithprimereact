import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('site') || "");
    const navigate = useNavigate();
    const loginAction = async (data) => {
        try {
            // const response = await fetch("https://localhost:7095/api/Auth/login", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(data),
            // });
            // const res = await response.json();
            if (true) {   // res
                // setUser(res.userName);
                // setToken(res.token);
                // localStorage.setItem("site", res.token);
                setUser('user@bookstore.com');
                setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGJvb2tzdG9yZS5jb20iLCJqdGkiOiJiZjBjZWQyZC00MjczLTQ2NWUtYWNkNC1jODk4NGNlMzIwMjQiLCJlbWFpbCI6InVzZXJAYm9va3N0b3JlLmNvbSIsInVpZCI6IjM5NmM2MDY1LTA0YjAtNGUwZC04ZmYxLWI1MGE4Y2NkNDY1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3MzE1Nzk3ODd9.dGKbEx6b8M2pTPefb8NGQbck1CQC4edP8oY1v040noI');
                localStorage.setItem("site","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGJvb2tzdG9yZS5jb20iLCJqdGkiOiJiZjBjZWQyZC00MjczLTQ2NWUtYWNkNC1jODk4NGNlMzIwMjQiLCJlbWFpbCI6InVzZXJAYm9va3N0b3JlLmNvbSIsInVpZCI6IjM5NmM2MDY1LTA0YjAtNGUwZC04ZmYxLWI1MGE4Y2NkNDY1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3MzE1Nzk3ODd9.dGKbEx6b8M2pTPefb8NGQbck1CQC4edP8oY1v040noI");
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