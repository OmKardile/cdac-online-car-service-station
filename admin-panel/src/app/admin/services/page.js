"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import { getServices, createService, updateService, deleteService } from "@/utils/api";

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const result = await getServices();
    if (result.status) {
      setServices(result.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      estimatedDuration: parseInt(formData.estimatedDuration),
    };

    let result;
    if (editing) {
      result = await updateService({ id: editing, ...payload });
    } else {
      result = await createService(payload);
    }

    if (result.status) {
      setFormData({ name: "", description: "", basePrice: "", estimatedDuration: "" });
      setEditing(null);
      setShowForm(false);
      fetchServices();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      const result = await deleteService(id);
      if (result.status) {
        fetchServices();
      }
    }
  };

  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
    });
    setEditing(service.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <>
        <Topbar title="Manage Services" />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Manage Services" />

      <div className="p-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditing(null);
            setFormData({ name: "", description: "", basePrice: "", estimatedDuration: "" });
          }}
          className="btn-primary w-32 mb-4"
        >
          {showForm ? "Cancel" : "Add Service"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="input"
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="text"
                className="input"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="number"
                step="0.01"
                className="input"
                placeholder="Base Price"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
              <input
                type="number"
                className="input"
                placeholder="Est. Duration (mins)"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary mt-4">
              {editing ? "Update" : "Create"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-t">
                  <td className="p-4">{service.name}</td>
                  <td className="p-4">{service.description}</td>
                  <td className="p-4">${service.basePrice}</td>
                  <td className="p-4">{service.estimatedDuration} mins</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
