"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { getAllBookings, updateBookingStatus } from "@/utils/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const result = await getAllBookings();
    if (result.status) {
      setBookings(result.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.status) {
      fetchBookings();
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Manage Bookings" />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Manage Bookings" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Service ID</th>
                <th className="p-4">Station ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="p-4">{booking.id}</td>
                  <td className="p-4">{booking.userId}</td>
                  <td className="p-4">{booking.serviceId}</td>
                  <td className="p-4">{booking.stationId}</td>
                  <td className="p-4">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">${booking.totalPrice}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
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
    </>
  );
}
