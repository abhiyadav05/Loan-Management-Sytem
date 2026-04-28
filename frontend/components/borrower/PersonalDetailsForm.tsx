"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/ui/Navbar";

export default function PersonalDetailsForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    pan: "",
    dateOfBirth: "",
    monthlySalary: "",
    employmentMode: "salaried",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/borrower/personal-details", form);
      router.push("/borrower/upload-salary");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Submission failed";
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
            <div className="h-1 flex-1 rounded bg-gray-200"></div>
            <div className="h-1 flex-1 rounded bg-gray-200"></div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Step 1 of 3</p>
          <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
            <input
              type="number"
              name="monthlySalary"
              value={form.monthlySalary}
              onChange={handleChange}
              min={0}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Mode</label>
            <select
              name="employmentMode"
              value={form.employmentMode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Checking eligibility..." : "Continue"}
          </button>
        </form>
      </div>
    </>
  );
}