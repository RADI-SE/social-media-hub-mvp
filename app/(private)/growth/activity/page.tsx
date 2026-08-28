"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ActivityPage() {
  const logs = useQuery(api.admin.listLogs);

  if (!logs) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Activity</h1>
      <div className="space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-500">No activity yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{log.action}</span>
                <span className="text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              {log.details && <p className="mt-1 text-sm text-gray-600">{log.details}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}