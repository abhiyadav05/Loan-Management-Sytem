import ProtectedRoute from "@/components/ui/ProtectedRoute";
import SalaryUploadForm from "@/components/borrower/SalaryUploadForm";

export default function UploadSalaryPage() {
  return (
    <ProtectedRoute allowedRoles={["borrower"]}>
      <SalaryUploadForm />
    </ProtectedRoute>
  );
}