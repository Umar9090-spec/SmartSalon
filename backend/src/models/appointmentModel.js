import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  stylistName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Booked", "Cancelled"],
    default: "Booked",
  },
});

// Unique index: only ONE "Booked" appointment per date+time slot
// Cancelled appointments don't count — they are allowed to share the slot
appointmentSchema.index(
  { date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
    name: "unique_booked_slot",
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
