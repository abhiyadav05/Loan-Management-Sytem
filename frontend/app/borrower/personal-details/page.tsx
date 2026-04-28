import ProtectedRoute from "@/components/ui/ProtectedRoute";
import PersonalDetailsForm from "@/components/borrower/PersonalDetailsForm";

export default function PersonalDetailsPage() {
  return (
    <ProtectedRoute allowedRoles={["borrower"]}>
      <PersonalDetailsForm />
    </ProtectedRoute>
  );
}