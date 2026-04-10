import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Sidebar>
      <main className="flex-1 p-8 bg-white min-h-screen">
        <Outlet />
      </main>
    </Sidebar>
  );
}
