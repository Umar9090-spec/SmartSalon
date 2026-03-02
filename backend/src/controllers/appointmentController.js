import Appointment from "../models/appointmentModel.js";

// GET all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single appointment by id
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper — build UTC day range from a date string like "2026-03-02"
const getDayRange = (dateInput) => {
  // Parse as UTC midnight so it matches exactly how Mongoose stores it
  const dateStr = typeof dateInput === "string"
    ? dateInput.split("T")[0]          // strip time part if ISO string
    : new Date(dateInput).toISOString().split("T")[0];

  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd   = new Date(`${dateStr}T23:59:59.999Z`);
  return { dayStart, dayEnd };
};

// POST create appointment — blocks duplicate date+time slot
export const createAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;

    const { dayStart, dayEnd } = getDayRange(date);

    const conflict = await Appointment.findOne({
      date: { $gte: dayStart, $lte: dayEnd },
      time: time.trim(),
      status: "Booked",
    });

    if (conflict) {
      return res.status(409).json({
        message: `The ${time} slot on this date is already booked. Please choose a different time.`,
      });
    }

    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    // Catch MongoDB duplicate key error (unique index fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This time slot is already booked on this date.",
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// PUT update appointment — checks conflict excluding self
export const updateAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;

    if (date && time) {
      const { dayStart, dayEnd } = getDayRange(date);

      const conflict = await Appointment.findOne({
        _id: { $ne: req.params.id },
        date: { $gte: dayStart, $lte: dayEnd },
        time: time.trim(),
        status: "Booked",
      });

      if (conflict) {
        return res.status(409).json({
          message: `The ${time} slot on this date is already booked. Please choose a different time.`,
        });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This time slot is already booked on this date.",
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// DELETE appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Appointment.countDocuments();
    const booked = await Appointment.countDocuments({ status: "Booked" });
    const cancelled = await Appointment.countDocuments({ status: "Cancelled" });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const perDay = await Appointment.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todayCount = await Appointment.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
    });

    res.status(200).json({ total, booked, cancelled, todayCount, perDay });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
