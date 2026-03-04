# 💈 Smart Salon — Appointment Management System

A full-stack web application for managing salon appointments. Built with **React**, **Node.js (Express)**, and **MongoDB**, it provides a clean dashboard, real-time booking with time-slot conflict prevention, and full CRUD management of appointments.

---

## ✨ Features

- **Dashboard** — Live stats showing total, booked, cancelled, and today's appointments, along with a daily appointments chart for the last 30 days.
- **Book Appointment** — Form to create new appointments with customer details, service type, stylist, date, and time.
- **Appointments Management** — Full list view with search, status filtering (All / Booked / Cancelled), inline editing, and deletion.
- **Time-Slot Conflict Prevention** — Booked time slots are disabled in the picker; duplicate bookings are blocked at both the application and database level (partial unique index).
- **Toast Notifications** — User-friendly success and error feedback via `react-hot-toast`.
- **Responsive Layout** — Sidebar navigation with a responsive table that hides less-critical columns on smaller screens.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| React Router DOM | 7 | Client-side routing |
| Axios | 1 | HTTP requests |
| Tailwind CSS | 3 | Utility-first styling |
| DaisyUI | 4 | Tailwind component library |
| react-hot-toast | 2 | Toast notifications |
| Vite | 7 | Build tool & dev server |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | 5 | Web framework |
| Mongoose | 9 | MongoDB ODM |
| MongoDB Atlas | — | Cloud database |
| dotenv | 17 | Environment variables |
| cors | 2 | Cross-origin resource sharing |
| nodemon | 3 | Dev auto-restart |

---

## 📁 Project Structure

```
Smart-Salon/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   └── appointmentController.js  # Business logic & route handlers
│   │   ├── models/
│   │   │   └── appointmentModel.js    # Mongoose schema & model
│   │   ├── routes/
│   │   │   └── appointmentRoutes.js   # Express route definitions
│   │   └── server.js                  # App entry point
│   ├── .env                           # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AppointmentForm.jsx    # Reusable form (create & edit)
    │   │   └── Sidebar.jsx            # Navigation sidebar
    │   ├── lib/
    │   │   └── axios.js               # Axios instance with base URL
    │   ├── pages/
    │   │   ├── DashboardPage.jsx      # Stats & daily appointments chart
    │   │   ├── BookAppointmentPage.jsx # New appointment page
    │   │   └── AppointmentsPage.jsx   # List, search, edit, delete
    │   ├── App.jsx                    # Root component & routes
    │   ├── main.jsx                   # React DOM entry point
    │   └── index.css                  # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🗄️ Database Schema

**Collection:** `appointments`

| Field | Type | Required | Notes |
|---|---|---|---|
| `customerName` | String | ✅ | Full name of the customer |
| `mobile` | String | ✅ | Contact number |
| `serviceType` | String | ✅ | e.g. Haircut, Facial, Massage |
| `date` | Date | ✅ | Appointment date |
| `time` | String | ✅ | e.g. "10:00 AM" |
| `stylistName` | String | ✅ | Assigned stylist |
| `status` | String | — | `"Booked"` (default) or `"Cancelled"` |

**Index:** A partial unique index on `{ date, time }` where `status === "Booked"` prevents double-booking a time slot. Cancelled appointments are allowed to share the same slot.

---

## 🔌 API Endpoints

Base URL: `http://localhost:3001`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check — returns API info |
| `GET` | `/appointments` | Get all appointments (sorted by date & time) |
| `GET` | `/appointments/stats` | Get dashboard statistics |
| `GET` | `/appointments/:id` | Get a single appointment by ID |
| `POST` | `/appointments` | Create a new appointment |
| `PUT` | `/appointments/:id` | Update an existing appointment |
| `DELETE` | `/appointments/:id` | Delete an appointment |

### Stats Response (`GET /appointments/stats`)
```json
{
  "total": 42,
  "booked": 35,
  "cancelled": 7,
  "todayCount": 5,
  "perDay": [
    { "_id": "2026-03-01", "count": 3 },
    { "_id": "2026-03-02", "count": 5 }
  ]
}
```

### Conflict Response (HTTP 409)
```json
{
  "message": "The 10:00 AM slot on this date is already booked. Please choose a different time."
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-salon.git
cd smart-salon
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string_here
```

> ⚠️ **Never commit your `.env` file.** Make sure it is listed in `.gitignore`.

Start the backend server:

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

The server will run at **http://localhost:3001**

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at **http://localhost:5173**

---

### 4. Open the App

Visit **http://localhost:5173** in your browser.

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Express server | `3001` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/salon_appointments` |

---

## 🔧 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (development) |
| `npm start` | Start server with node (production) |

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎨 Services & Stylists

The following services and stylists are pre-configured in the booking form:

**Services:** Haircut, Hair Coloring, Hair Styling, Facial, Manicure, Pedicure, Massage, Eyebrow Threading

**Stylists:** Sarah Johnson, Mike Chen, Emily Davis, Alex Rodriguez, Jessica Wilson

**Available Time Slots:** 10:00 AM – 8:00 PM in 30-minute intervals

---

## 🔒 Known Considerations

- The `.env` file contains the MongoDB URI with credentials — **do not push this to GitHub**. Add it to `.gitignore` before your first commit:
  ```
  backend/.env
  ```
- CORS is configured to allow only `http://localhost:5173`. Update `server.js` if you deploy the frontend to a different origin.
- There is currently no authentication or user management — the app is intended for internal salon staff use.

---

## 📦 Deployment Notes

When deploying:

1. **Backend** — Deploy to platforms like [Render](https://render.com), [Railway](https://railway.app), or [Fly.io]. Set environment variables (`PORT`, `MONGO_URI`) in the platform's dashboard.
2. **Frontend** — Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Update the `baseURL` in `frontend/src/lib/axios.js` to point to your deployed backend URL.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

> Umar 
