"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loan, Payment, User } from "@/types";

export default function CollectionModule() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({ utrNumber: "", amount: "", paymentDate: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/collection/loans").then((res) => {
      setLoans(res.data);
      setLoading(false);
    });
  }, []);

  const openPayments = async (loan: Loan) => {
    setSelectedLoan(loan);
    setError("");
    const res = await api.get(`/collection/loans/${loan._id}/payments`);
    setPayments(res.data);
  };

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    setError("");
    try {
      await api.post(`/collection/loans/${selectedLoan._id}/payment`, {
        ...form,
        amount: Number(form.amount),
      });
      setForm({ utrNumber: "", amount: "", paymentDate: "" });
      const res = await api.get(`/collection/loans/${selectedLoan._id}/payments`);
      setPayments(res.data);
      const loansRes = await api.get("/collection/loans");
      setLoans(loansRes.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Payment failed";
      setError(msg);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Collection Module</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Borrower</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Repayment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(loan.borrower as User).name}</td>
                  <td className="px-4 py-3">₹{loan.totalRepayment.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openPayments(loan)}
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Record Payment
                    </button>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400 py-6">No active loans</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedLoan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-1">Record Payment</h3>
            <p className="text-xs text-gray-500 mb-4">
              Total: ₹{selectedLoan.totalRepayment.toFixed(2)} | Paid: ₹{totalPaid.toFixed(2)} | Outstanding: ₹{(selectedLoan.totalRepayment - totalPaid).toFixed(2)}
            </p>
            {error && <p className="text-danger text-xs mb-3 bg-red-50 p-2 rounded">{error}</p>}
            <form onSubmit={submitPayment} className="space-y-3 mb-4">
              <input
                placeholder="UTR Number"
                value={form.utrNumber}
                onChange={(e) => setForm({ ...form, utrNumber: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={form.paymentDate}
                onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg text-sm font-medium">
                  Submit
                </button>
                <button type="button" onClick={() => setSelectedLoan(null)} className="flex-1 border border-black  bg-red-400 hover:bg-red-300 py-2 rounded-lg text-sm">
                  Close
                </button>
              </div>
            </form>
            {payments.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment History</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {payments.map((p) => (
                    <div key={p._id} className="flex justify-between text-xs text-gray-700 bg-gray-50 px-3 py-1.5 rounded">
                      <span>{p.utrNumber}</span>
                      <span>₹{p.amount}</span>
                      <span>{new Date(p.paymentDate).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}