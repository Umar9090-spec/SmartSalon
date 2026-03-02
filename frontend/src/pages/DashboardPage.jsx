import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";

const StatCard = ({ label, value, sub, accent }) => (
  <div className="bg-base-100 rounded-xl border border-base-300 p-5 flex flex-col gap-1">
    <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">{label}</p>
    <p className={`text-4xl font-bold ${accent}`}>{value}</p>
    <p className="text-xs text-base-content/50">{sub}</p>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/appointments/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Page header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        </div>
        <Link to="/book" className="btn btn-primary btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Booking
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats?.total ?? 0} sub="All time" accent="text-base-content" />
        <StatCard label="Booked" value={stats?.booked ?? 0} sub="Active" accent="text-success" />
        <StatCard label="Cancelled" value={stats?.cancelled ?? 0} sub="Inactive" accent="text-error" />
        <StatCard label="Today" value={stats?.todayCount ?? 0} sub="Scheduled today" accent="text-primary" />
      </div>

      {/* Customers Per Day */}
      <div className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
        <div className="px-6 py-4 border-b border-base-300 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base-content text-sm">Daily Appointments</h2>
            <p className="text-xs text-base-content/40 mt-0.5">Last 30 days</p>
          </div>
          <Link to="/appointments" className="text-xs text-primary font-medium hover:underline">
            View all →
          </Link>
        </div>

        {!stats?.perDay?.length ? (
          <div className="py-16 text-center text-base-content/30 text-sm">
            No data in the last 30 days
          </div>
        ) : (
          <div className="divide-y divide-base-300">
            {stats.perDay.map((row) => (
              <div key={row._id} className="flex items-center px-6 py-3 gap-4">
                <p className="text-sm text-base-content/70 w-44 shrink-0">
                  {new Date(row._id).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                  })}
                </p>
                <div className="flex-1 bg-base-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(row.count * 12, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-base-content w-6 text-right">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
