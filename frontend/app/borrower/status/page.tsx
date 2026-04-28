"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loan } from "@/types";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  applied: { label: "Applied", color: "text-yellow-700", bg: "bg-yellow-100" },
  sanctioned: { label: "Sanctioned", color: "text-blue-700", bg: "bg-blue-100" },
  disbursed: { label: "Disbursed", color: "text-purple-700", bg: "bg-purple-100" },
  closed: { label: "Closed", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "Rejected", color: "text-red-700", bg: "bg-red-100" },
};

const steps = ["applied", "sanctioned", "disbursed", "closed"];

function LoanStatusContent() {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get("/borrower/loan-status")
      .then((res) => {
        if (res.data) {
          setLoan(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </>
    );
  }

  if (notFound || !loan) {
    return (
      <>
        <Navbar />
        <div className="max-w-lg mx-auto mt-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Loan Application Yet</h2>
          <p className="text-gray-500 text-sm mb-6">You haven&apos;t applied for a loan yet.</p>
          <Link
            href="/borrower/personal-details"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </>
    );
  }

  const cfg = statusConfig[loan.status] || statusConfig.applied;
  const currentStepIndex = steps.indexOf(loan.status);

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Loan Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>

          {loan.status !== "rejected" && (
            <div className="mb-6">
              <div className="flex items-center">
                {steps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          i <= currentStepIndex
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i < currentStepIndex ? "✓" : i + 1}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 capitalize">{step}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-4 ${i < currentStepIndex ? "bg-blue-600" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loan.status === "rejected" && loan.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-red-700 mb-1">Application Rejected</p>
              <p className="text-sm text-red-600">{loan.rejectionReason}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
              <p className="text-lg font-bold text-gray-900">₹{loan.amount.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Tenure</p>
              <p className="text-lg font-bold text-gray-900">{loan.tenure} days</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Interest (12% p.a.)</p>
              <p className="text-lg font-bold text-gray-900">₹{loan.simpleInterest.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-600 mb-1">Total Repayment</p>
              <p className="text-lg font-bold text-blue-700">₹{loan.totalRepayment.toFixed(2)}</p>
            </div>
          </div>

          {loan.disbursedAt && (
            <div className="mt-4 text-sm text-gray-500">
              Disbursed on: {new Date(loan.disbursedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </div>
          )}
          {loan.closedAt && (
            <div className="mt-1 text-sm text-green-600 font-medium">
              Loan closed on: {new Date(loan.closedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </div>
          )}
        </div>

        {loan.status === "rejected" && (
          <div className="text-center">
            <Link
              href="/borrower/personal-details"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Re-apply
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function LoanStatusPage() {
  return (
    <ProtectedRoute allowedRoles={["borrower"]}>
      <LoanStatusContent />
    </ProtectedRoute>
  );
}