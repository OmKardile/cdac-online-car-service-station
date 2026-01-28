"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { getAdminStatistics } from "@/utils/api";
import { useAuth } from "@/utils/useAuth";

export default function SuperAdminDashboard() {
  useAuth("superadmin");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getAdminStatistics();
      if (result.status || result.status === 'success') {
        const data = result.data || result;
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <Topbar title="Super Admin Dashboard" />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  const revenue = stats ? parseFloat(stats.revenue || 0) : 0;

  return (
    <>
      <Topbar title="Super Admin Dashboard" />
      <div className="p-6 grid grid-cols-3 gap-4">
        <StatCard title="Total Users" value={stats?.users || 0} />
        <StatCard title="Total Bookings" value={stats?.bookings || 0} />
        <StatCard title="Total Revenue" value={`$${revenue.toFixed(2)}`} />
      </div>
    </>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
