"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/ui/Navbar";

export default function SalaryUploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("salarySlip", file);
    try {
      await api.post("/borrower/upload-salary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/borrower/loan-config");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Upload failed";
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
            <div className="h-1 flex-1 rounded bg-gray-200"></div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Step 2 of 3</p>
          <h2 className="text-2xl font-bold text-gray-900">Upload Salary Slip</h2>
          <p className="text-sm text-gray-500 mt-1">PDF, JPG or PNG — max 5MB</p>
        </div>
        {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="file"
            className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm font-medium text-gray-700">
              {file ? file.name : "Click to select file"}
            </p>
            {!file && <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" id="file" />
          </label>
          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Uploading..." : "Continue"}
          </button>
        </form>
      </div>
    </>
  );
}