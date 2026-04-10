import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface IAuthContext {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!token;

  function login(newToken: string) {
    setToken(newToken);
    console.log("Token set:", newToken);
    localStorage.setItem("authToken", newToken);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
