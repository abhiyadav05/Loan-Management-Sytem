"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loan, User } from "@/types";

export default function SanctionModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const fetchLoans = () => {
    api.get("/sanction/loans").then((res) => {
      setLoans(res.data);
      setLoading(false);
    });
  };

  useEffect(fetchLoans, []);

  const sanction = async (id: string) => {
    await api.put(`/sanction/loans/${id}/sanction`);
    fetchLoans();
  };

  const reject = async () => {
    if (!rejectId || !reason) return;
    await api.put(`/sanction/loans/${rejectId}/reject`, { reason });
    setRejectId(null);
    setReason("");
    fetchLoans();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sanction Module</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Borrower</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tenure</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(loan.borrower as User).name}</td>
                  <td className="px-4 py-3">₹{loan.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{loan.tenure}d</td>
                  <td className="px-4 py-3">₹{loan.totalRepayment.toFixed(2)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => sanction(loan._id)}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectId(loan._id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">No applied loans</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {rejectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Rejection Reason</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-danger"
              rows={3}
              placeholder="Enter reason..."
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectId(null)} className="text-sm px-4 py-1.5 border border-gray-300 rounded-lg">
                Cancel
              </button>
              <button onClick={reject} className="text-sm px-4 py-1.5 bg-danger text-white rounded-lg">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}