import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import StatsCard from "../components/admin/StatsCard";
import EnquiryTable from "../components/admin/EnquiryTable";
import { Inbox, Clock, UserPlus, PhoneCall, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          adminApi.get("/stats"),
          adminApi.get("/enquiries?page=1&limit=5&sort=newest"),
        ]);
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data);
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const cards = [
    { title: "Total Enquiries", value: stats.total, icon: Inbox, color: "bg-blue-100 text-[#1E3A8A]" },
    { title: "New", value: stats.new, icon: UserPlus, color: "bg-green-100 text-green-700" },
    { title: "Today", value: stats.today, icon: Clock, color: "bg-orange-100 text-orange-700" },
    { title: "Follow Ups", value: stats.follow_up, icon: PhoneCall, color: "bg-indigo-100 text-indigo-700" },
    { title: "Quotations Sent", value: stats.quotation_sent, icon: CheckCircle, color: "bg-purple-100 text-purple-700" },
    { title: "Won", value: stats.won, icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
    { title: "Lost", value: stats.lost, icon: XCircle, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of customer enquiries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <StatsCard key={idx} {...card} />
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-700">Recent Enquiries</h2>
          <Link to="/arrowline-admin/enquiries" className="text-sm text-[#1E3A8A] hover:text-[#FF7A00] font-medium">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-slate-200 text-slate-500">
            No enquiries found.
          </div>
        ) : (
          <EnquiryTable enquiries={recent} />
        )}
      </div>
    </div>
  );
}