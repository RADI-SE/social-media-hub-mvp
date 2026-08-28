"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"; // or any toast library you use
import { useState } from "react";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "cmo", label: "CMO" },
  { value: "marketing_manager", label: "Marketing Manager" },
  { value: "social_media_user", label: "Social Media User" },
];

export default function TeamPage() {
  const users = useQuery(api.admin.listUsers);
  const updateRole = useMutation(api.admin.updateUserRole);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await updateRole({ userId, role: newRole });
      toast.success("Role updated");
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!users) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name ?? "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email ?? "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role ?? "social_media_user"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role ?? "social_media_user"}
                    disabled={updatingId === user._id}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}