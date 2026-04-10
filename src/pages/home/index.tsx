import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  return (
    <Sidebar>
      <h1 className="text-2xl font-bold text-blue-700">Bem-vindo!</h1>
    </Sidebar>
  );
}
