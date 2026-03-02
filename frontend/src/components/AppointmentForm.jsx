import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2 text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition";

const AppointmentForm = ({
  onSubmit, initialData, onCancel,
  selectedDate, setSelectedDate, appointmentsPerDay,
}) => {
  const [formData, setFormData] = useState({
    customerName: "", mobile: "", serviceType: "",
    date: "", time: "", stylistName: "", status: "Booked",
  });
  const [bookedSlots, setBookedSlots] = useState([]);

  const serviceTypes = [
    "Haircut", "Hair Coloring", "Hair Styling", "Facial",
    "Manicure", "Pedicure", "Massage", "Eyebrow Threading",
  ];
  const stylists = [
    "Sarah Johnson", "Mike Chen", "Emily Davis",
    "Alex Rodriguez", "Jessica Wilson",
  ];
  const timeSlots = [
    "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM","1:30 PM",
    "2:00 PM","2:30 PM","3:00 PM","3:30 PM",
    "4:00 PM","4:30 PM","5:00 PM","5:30 PM",
    "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM",
  ];

  useEffect(() => {
    if (initialData) {
      const d = new Date(initialData.date).toISOString().split("T")[0];
      setFormData({ ...initialData, date: d });
      setSelectedDate(d);
      fetchBookedSlots(d, initialData._id);
    }
  }, [initialData]);

  const fetchBookedSlots = async (date, excludeId = null) => {
    if (!date) return;
    try {
      const res = await axiosInstance.get("/appointments");
      const inputDateStr = date.split("T")[0];
      const slots = res.data
        .filter((a) => {
          const aDate = new Date(a.date).toISOString().split("T")[0];
          return aDate === inputDateStr && a.status === "Booked" && (excludeId ? a._id !== excludeId : true);
        })
        .map((a) => a.time);
      setBookedSlots(slots);
    } catch {
      setBookedSlots([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (name === "date") {
      setSelectedDate(value);
      fetchBookedSlots(value, initialData?._id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookedSlots.includes(formData.time) && formData.status === "Booked") return;
    onSubmit(formData);
    if (!initialData) {
      setFormData({ customerName: "", mobile: "", serviceType: "", date: "", time: "", stylistName: "", status: "Booked" });
      setSelectedDate("");
      setBookedSlots([]);
    }
  };

  const slotTaken = formData.status === "Booked" && !!formData.time && bookedSlots.includes(formData.time);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Row 1 — Customer + Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Customer Name">
          <input type="text" name="customerName" value={formData.customerName}
            onChange={handleChange} className={inputCls} placeholder="Full name" required />
        </Field>
        <Field label="Mobile Number">
          <input type="tel" name="mobile" value={formData.mobile}
            onChange={handleChange} className={inputCls} placeholder="Phone number" required />
        </Field>
      </div>

      {/* Row 2 — Service + Stylist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Service Type">
          <select name="serviceType" value={formData.serviceType}
            onChange={handleChange} className={inputCls} required>
            <option value="">Select service</option>
            {serviceTypes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Stylist">
          <select name="stylistName" value={formData.stylistName}
            onChange={handleChange} className={inputCls} required>
            <option value="">Select stylist</option>
            {stylists.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      {/* Row 3 — Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date">
          <input type="date" name="date" value={formData.date}
            onChange={handleChange} className={inputCls}
            min={new Date().toISOString().split("T")[0]} required />
          {selectedDate && (
            <p className="text-xs text-base-content/50 mt-1">
              {appointmentsPerDay} booking{appointmentsPerDay !== 1 ? "s" : ""} on this date
            </p>
          )}
        </Field>
        <Field label="Time Slot">
          <select name="time" value={formData.time}
            onChange={handleChange} className={inputCls} required>
            <option value="">Select time</option>
            {timeSlots.map((t) => {
              const taken = bookedSlots.includes(t);
              return (
                <option key={t} value={t} disabled={taken}>
                  {t}{taken ? " — Booked" : ""}
                </option>
              );
            })}
          </select>
          {slotTaken && (
            <p className="text-xs text-error mt-1">This slot is already taken.</p>
          )}
        </Field>
      </div>

      {/* Status */}
      <Field label="Status">
        <div className="flex gap-3">
          {["Booked", "Cancelled"].map((s) => (
            <label key={s} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all ${
              formData.status === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-base-300 bg-base-200 text-base-content/60 hover:border-base-content/30"
            }`}>
              <input type="radio" name="status" value={s}
                checked={formData.status === s} onChange={handleChange} className="hidden" />
              {s}
            </label>
          ))}
        </div>
      </Field>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn btn-primary btn-sm flex-1" disabled={slotTaken}>
          {initialData ? "Save Changes" : "Book Appointment"}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
            Cancel
          </button>
        )}
      </div>

    </form>
  );
};

export default AppointmentForm;
