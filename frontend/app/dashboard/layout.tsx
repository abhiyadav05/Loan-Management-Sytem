import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "sales", "sanction", "disbursement", "collection"]}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}