import ProtectedRoute from "@/components/ui/ProtectedRoute";
import LoanConfigForm from "@/components/borrower/LoanConfigForm";

export default function LoanConfigPage() {
  return (
    <ProtectedRoute allowedRoles={["borrower"]}>
      <LoanConfigForm />
    </ProtectedRoute>
  );
}