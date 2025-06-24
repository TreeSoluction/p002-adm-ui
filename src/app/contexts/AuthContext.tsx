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

  // Login: salva token (pode ser localStorage ou só estado)
  function login(newToken: string) {
    setToken(newToken);
    // opcional: salvar no localStorage para persistência
    localStorage.setItem("authToken", newToken);
  }

  // Logout: limpa token e redireciona para login
  function logout() {
    setToken(null);
    localStorage.removeItem("authToken");
    router.push("/login");
  }

  // Ao montar, tenta recuperar token do localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Configura interceptor axios para logout automático em 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
