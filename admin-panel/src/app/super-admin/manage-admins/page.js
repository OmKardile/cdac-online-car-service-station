"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { getAllUsers, updateUserRole } from "@/utils/api";

export default function ManageAdmins() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("admin");

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

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    return u.role === filter;
  });

  if (loading) {
    return (
      <>
        <Topbar title="Manage Admins" />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Manage Admins" />

      <div className="p-6">
        <div className="flex gap-4 mb-6">
          {["all", "client", "admin", "superadmin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded ${
                filter === role
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Current Role</th>
                <th className="p-4">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === "superadmin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
