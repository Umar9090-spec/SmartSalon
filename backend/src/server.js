import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    // origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Smart Salon Appointment Management System API" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("http://localhost:" + PORT);
});
