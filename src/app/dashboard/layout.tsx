import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-white min-h-screen">{children}</main>
    </div>
  );
}
