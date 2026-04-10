import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";

// Dashboard modules
import ExcursoesPage from "@/pages/dashboard/excursoes";
import ExcursoesFormPage from "@/pages/dashboard/excursoes/form";
import HospedagensPage from "@/pages/dashboard/hospedagens";
import HospedagensFormPage from "@/pages/dashboard/hospedagens/form";
import RestaurantesPage from "@/pages/dashboard/restaurantes";
import RestaurantesFormPage from "@/pages/dashboard/restaurantes/form";
import QuiosquesPage from "@/pages/dashboard/quiosques";
import QuiosquesFormPage from "@/pages/dashboard/quiosques/form";
import EstacionamentosPage from "@/pages/dashboard/estacionamentos";
import EstacionamentosFormPage from "@/pages/dashboard/estacionamentos/form";
import MalhariasPage from "@/pages/dashboard/malharias";
import MalhariasFormPage from "@/pages/dashboard/malharias/form";
import TransportadorasPage from "@/pages/dashboard/transportadoras";
import TransportadorasFormPage from "@/pages/dashboard/transportadoras/form";
import CidadesPage from "@/pages/dashboard/cidades";
import CidadesFormPage from "@/pages/dashboard/cidades/form";
import CalendarioPage from "@/pages/dashboard/calendario";
import CalendarioFormPage from "@/pages/dashboard/calendario/form";
import CarroselPage from "@/pages/dashboard/carrosel";
import CarroselFormPage from "@/pages/dashboard/carrosel/form";
import LojasPage from "@/pages/dashboard/lojas";
import LojasFormPage from "@/pages/dashboard/lojas/form";
import FreteirosPage from "@/pages/dashboard/freteiros";
import FreteirosFormPage from "@/pages/dashboard/freteiros/form";
import CategoriasPage from "@/pages/dashboard/categorias";
import CategoriasFormPage from "@/pages/dashboard/categorias/form";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route path="excursoes" element={<ExcursoesPage />} />
        <Route path="excursoes/:id" element={<ExcursoesFormPage />} />

        <Route path="hospedagens" element={<HospedagensPage />} />
        <Route path="hospedagens/:id" element={<HospedagensFormPage />} />

        <Route path="restaurantes" element={<RestaurantesPage />} />
        <Route path="restaurantes/:id" element={<RestaurantesFormPage />} />

        <Route path="quiosques" element={<QuiosquesPage />} />
        <Route path="quiosques/:id" element={<QuiosquesFormPage />} />

        <Route path="estacionamentos" element={<EstacionamentosPage />} />
        <Route path="estacionamentos/:id" element={<EstacionamentosFormPage />} />

        <Route path="malharias" element={<MalhariasPage />} />
        <Route path="malharias/:id" element={<MalhariasFormPage />} />

        <Route path="transportadoras" element={<TransportadorasPage />} />
        <Route path="transportadoras/:id" element={<TransportadorasFormPage />} />

        <Route path="cidades" element={<CidadesPage />} />
        <Route path="cidades/:id" element={<CidadesFormPage />} />

        <Route path="calendario" element={<CalendarioPage />} />
        <Route path="calendario/:id" element={<CalendarioFormPage />} />

        <Route path="carrosel" element={<CarroselPage />} />
        <Route path="carrosel/:id" element={<CarroselFormPage />} />

        <Route path="lojas" element={<LojasPage />} />
        <Route path="lojas/:id" element={<LojasFormPage />} />

        <Route path="freteiros" element={<FreteirosPage />} />
        <Route path="freteiros/:id" element={<FreteirosFormPage />} />

        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="categorias/:id" element={<CategoriasFormPage />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
