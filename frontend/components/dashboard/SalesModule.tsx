"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@/types";

export default function SalesModule() {
  const [leads, setLeads] = useState<User[]>([]);
  const [borrowers, setBorrowers] = useState<User[]>([]);
  const [tab, setTab] = useState<"leads" | "all">("leads");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/sales/leads"), api.get("/sales/borrowers")]).then(([l, b]) => {
      setLeads(l.data);
      setBorrowers(b.data);
      setLoading(false);
    });
  }, []);

  const data = tab === "leads" ? leads : borrowers;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Module</h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("leads")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "leads"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Leads ({leads.length})
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Borrowers ({borrowers.length})
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">BRE</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.breCleared
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {u.breCleared ? "Cleared" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">—</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}