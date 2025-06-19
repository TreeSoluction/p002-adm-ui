import Sidebar from "../components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <main className="flex-1 p-8 bg-white min-h-screen">{children}</main>
    </Sidebar>
  );    
}
