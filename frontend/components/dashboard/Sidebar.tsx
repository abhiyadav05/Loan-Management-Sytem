"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const modules = [
  { label: "Sales", href: "/dashboard/sales", roles: ["sales", "admin"] },
  { label: "Sanction", href: "/dashboard/sanction", roles: ["sanction", "admin"] },
  { label: "Disbursement", href: "/dashboard/disbursement", roles: ["disbursement", "admin"] },
  { label: "Collection", href: "/dashboard/collection", roles: ["collection", "admin"] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const accessible = modules.filter((m) => user && m.roles.includes(user.role));

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen pt-6 px-3 shrink-0">
      {user?.role === "admin" && (
        <div className="mx-3 mb-4 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs font-semibold text-blue-700">Admin</p>
          <p className="text-xs text-blue-500">Full access</p>
        </div>
      )}
      <p className="text-xs text-gray-400 uppercase tracking-wider px-3 mb-3">Modules</p>
      <nav className="space-y-1">
        {accessible.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === m.href
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}