"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === "admin" || user.role === "sales") {
      router.replace("/dashboard/sales");
    } else {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-gray-400 text-sm">Redirecting...</p>
    </div>
  );
}