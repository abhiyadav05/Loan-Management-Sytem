"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/ui/Navbar";

export default function LoanConfigForm() {
  const router = useRouter();
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const si = (amount * 12 * tenure) / (365 * 100);
  const total = amount + si;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/borrower/apply", { amount, tenure });
      router.push("/borrower/status");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Application failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="flex gap-1 mb-4">
            <div className="h-1 flex-1 rounded bg-blue-600"></div>
            <div className="h-1 flex-1 rounded bg-blue-600"></div>
            <div className="h-1 flex-1 rounded bg-blue-600"></div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Step 3 of 3</p>
          <h2 className="text-2xl font-bold text-gray-900">Loan Configuration</h2>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="font-medium text-gray-700">Loan Amount</label>
              <span className="text-blue-600 font-semibold">₹{amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="font-medium text-gray-700">Tenure</label>
              <span className="text-blue-600 font-semibold">{tenure} days</span>
            </div>
            <input
              type="range"
              min={30}
              max={365}
              step={5}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Principal</span>
              <span>₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Interest (12% p.a., {tenure} days)</span>
              <span>₹{si.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2">
              <span>Total Repayment</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Applying..." : "Apply for Loan"}
          </button>
        </form>
      </div>
    </>
  );
}