import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import AppointmentForm from "../components/AppointmentForm.jsx";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentsPerDay, setAppointmentsPerDay] = useState(0);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axiosInstance.get("/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => toast.error("Error fetching appointments"));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) { setAppointmentsPerDay(0); return; }
    const count = appointments.filter(
      (a) => new Date(a.date).toISOString().split("T")[0] === date.split("T")[0]
    ).length;
    setAppointmentsPerDay(count);
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await axiosInstance.put(`/appointments/${editingAppointment._id}`, formData);
      setAppointments(appointments.map((a) => a._id === editingAppointment._id ? res.data : a));
      setEditingAppointment(null);
      toast.success("Appointment updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating appointment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axiosInstance.delete(`/appointments/${id}`);
      setAppointments(appointments.filter((a) => a._id !== id));
      toast.success("Deleted!");
    } catch {
      toast.error("Error deleting appointment");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filtered = appointments.filter((a) => {
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      a.customerName.toLowerCase().includes(q) ||
      a.mobile.includes(q) ||
      a.serviceType.toLowerCase().includes(q) ||
      a.stylistName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">

      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">Records</p>
          <h1 className="text-3xl font-bold text-base-content">Appointments</h1>
        </div>
        <span className="text-sm text-base-content/40">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, mobile, service, stylist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-base-100 border border-base-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <div className="flex rounded-lg border border-base-300 overflow-hidden text-sm">
          {["All", "Booked", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 font-medium transition-all ${
                filterStatus === s
                  ? "bg-primary text-primary-content"
                  : "bg-base-100 text-base-content/60 hover:bg-base-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 ${editingAppointment ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

        {/* Edit panel */}
        {editingAppointment && (
          <div className="bg-base-100 rounded-xl border border-base-300 p-6 lg:sticky lg:top-8 self-start">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">Editing</p>
                <h2 className="font-bold text-base-content">{editingAppointment.customerName}</h2>
              </div>
              <button onClick={() => setEditingAppointment(null)} className="btn btn-ghost btn-xs btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AppointmentForm
              onSubmit={handleUpdate}
              initialData={editingAppointment}
              onCancel={() => setEditingAppointment(null)}
              selectedDate={selectedDate}
              setSelectedDate={handleDateChange}
              appointmentsPerDay={appointmentsPerDay}
            />
          </div>
        )}

        {/* Table */}
        <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-base-content/30 text-sm">
              No appointments found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200 text-xs uppercase tracking-widest text-base-content/40">
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Service</th>
                  <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Stylist</th>
                  <th className="text-left px-5 py-3 font-semibold">Date & Time</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-base-200/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-base-content">{a.customerName}</p>
                      <p className="text-xs text-base-content/40">{a.mobile}</p>
                    </td>
                    <td className="px-5 py-3.5 text-base-content/70 hidden md:table-cell">{a.serviceType}</td>
                    <td className="px-5 py-3.5 text-base-content/70 hidden lg:table-cell">{a.stylistName}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-base-content/80">{formatDate(a.date)}</p>
                      <p className="text-xs text-base-content/40">{a.time}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        a.status === "Booked"
                          ? "bg-success/15 text-success"
                          : "bg-error/15 text-error"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingAppointment(a)}
                          className="btn btn-ghost btn-xs text-primary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default AppointmentsPage;
