import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedToken && storedUser) {
      const expiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
      if (expiry && expiry > Date.now()) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // Token expired
        logout();
      }
    }
  }, []);

  const login = (token, user) => {
    const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("tokenExpiry", expiry.toString());
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
