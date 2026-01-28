"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { getAllUsers, updateUserRole, updateUserStatus } from "@/utils/api";

export default function ManageStaff() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const result = await getAllUsers();
    if (result.status) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole);
    if (result.status) {
      fetchUsers();
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    const result = await updateUserStatus(userId, !isActive);
    if (result.status) {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Manage Staff" />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Manage Staff" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(user.id, user.isActive)}
                      className="text-indigo-600 hover:underline text-xs"
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
