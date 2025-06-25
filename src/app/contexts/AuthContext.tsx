"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IAuthContext {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!token;

  function login(newToken: string) {
    setToken(newToken);
    console.log("Token set:", newToken);
    localStorage.setItem("authToken", newToken);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("authToken");
    router.push("/login");
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
