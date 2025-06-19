"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Excursões", href: "/dashboard/excursoes" },
  { label: "Hospedagem", href: "/dashboard/hospedagem" },
];

type SidebarProps = {
  children: ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-700 text-white flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-10 text-2xl font-bold text-center tracking-wide">
          Gestão
        </div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition 
                  ${
                    pathname === item.href ? "bg-blue-900" : "hover:bg-blue-800"
                  }`}
                type="button"
              >
                {item.label}
              </button>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1  bg-white">{children}</main>
    </div>
  );
}
