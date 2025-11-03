import { createContext, useContext, useMemo, useState } from "react";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(()=> localStorage.getItem("token"));
    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null)
        window.location.href = "/login"; 
}
    const value = useMemo(() => ({ token, login, logout }), [token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}