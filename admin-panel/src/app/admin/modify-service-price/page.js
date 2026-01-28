"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";

const data = [
  { id: 1, name: "Service A", price: 199, active: true },
  { id: 2, name: "Service B", price: 299, active: true },
  { id: 3, name: "Service C", price: 399, active: false },
];

export default function ModifyServicePrice() {
  const [services, setServices] = useState(data);

  const toggle = (id) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  return (
    <>
      <Topbar title="Manage Services" />

      <div className="p-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-4">{s.name}</td>

                  <td className="p-4">
                    <input
                      type="number"
                      value={s.price}
                      className="border rounded px-3 py-1 w-24"
                      onChange={(e) =>
                        setServices(
                          services.map((x) =>
                            x.id === s.id
                              ? { ...x, price: e.target.value }
                              : x
                          )
                        )
                      }
                    />
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        s.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.active ? "Active" : "Disabled"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggle(s.id)}
                      className="text-indigo-600 hover:underline"
                    >
                      {s.active ? "Disable" : "Enable"}
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
