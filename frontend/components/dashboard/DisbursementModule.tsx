"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loan, User } from "@/types";

export default function DisbursementModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = () => {
    api.get("/disbursement/loans").then((res) => {
      setLoans(res.data);
      setLoading(false);
    });
  };

  useEffect(fetchLoans, []);

  const disburse = async (id: string) => {
    await api.put(`/disbursement/loans/${id}/disburse`);
    fetchLoans();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Disbursement Module</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Borrower</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Repayment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(loan.borrower as User).name}</td>
                  <td className="px-4 py-3">₹{loan.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{loan.totalRepayment.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => disburse(loan._id)}
                      className="text-xs bg-blue-400 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Mark Disbursed
                    </button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">No sanctioned loans</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}