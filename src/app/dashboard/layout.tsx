import Sidebar from "../components/sidebar";
import { AuthContextProvider } from "../contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContextProvider>
      <Sidebar>
        <main className="flex-1 p-8 bg-white min-h-screen">{children}</main>
      </Sidebar>
    </AuthContextProvider>
  );
}
