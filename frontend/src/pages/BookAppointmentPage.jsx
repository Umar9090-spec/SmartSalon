import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import AppointmentForm from "../components/AppointmentForm.jsx";

const BookAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentsPerDay, setAppointmentsPerDay] = useState(0);
  const navigate = useNavigate();

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (!date) return;
    try {
      const res = await axiosInstance.get("/appointments");
      const inputDateStr = date.split("T")[0];
      const count = res.data.filter(
        (a) => new Date(a.date).toISOString().split("T")[0] === inputDateStr
      ).length;
      setAppointmentsPerDay(count);
    } catch {
      setAppointmentsPerDay(0);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await axiosInstance.post("/appointments", formData);
      toast.success("Appointment booked!");
      navigate("/appointments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking appointment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">New</p>
        <h1 className="text-3xl font-bold text-base-content">Book Appointment</h1>
      </div>

      {/* Form card */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <AppointmentForm
          onSubmit={handleSubmit}
          initialData={null}
          onCancel={null}
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          appointmentsPerDay={appointmentsPerDay}
        />
      </div>

    </div>
  );
};

export default BookAppointmentPage;
