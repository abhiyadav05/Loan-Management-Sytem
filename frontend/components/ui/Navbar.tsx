"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">LMS Portal</h1>
      <div className="flex items-center gap-4">
        {user?.role === "borrower" && (
          <Link
            href="/borrower/status"
            className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            My Loan
          </Link>
        )}
        {user && (
          <>
            <span className="text-sm text-gray-600">
              {user.name} <span className="text-xs text-gray-400 capitalize">({user.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}