import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BookAppointmentPage from "./pages/BookAppointmentPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";

const App = () => {
  return (
    <div className="flex min-h-screen bg-base-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/book" element={<BookAppointmentPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
