"use client";
import { useContext, useEffect } from "react";
import Sidebar from "./components/sidebar";
import { AuthContext } from "./contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return (
    <Sidebar>
      <h1 className="text-2xl font-bold text-blue-700">Bem-vindo!</h1>
    </Sidebar>
  );
}
