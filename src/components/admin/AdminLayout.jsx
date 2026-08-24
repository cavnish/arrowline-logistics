import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Inbox, LogOut } from "lucide-react";
import adminApi from "../../services/adminApi";
import { useAdminAuth } from "../../admin/AdminAuthProvider";

const sidebarLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/content", label: "Content", icon: LayoutDashboard },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { signOut, user } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await adminApi.post("/logout");
    } catch (e) {
      // ignore
    }
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-[#1E3A8A] text-white hidden md:flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-blue-800/50">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black">AL</span>
            <span className="text-sm font-semibold">Admin Portal</span>
          </div>
        </div>
        <nav className="flex-1 py-6">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 border-r-4 border-[#FF7A00]"
                    : "hover:bg-white/5"
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800/50">
          <p className="px-4 pb-3 text-xs text-blue-100 truncate">{user?.email || "Administrator"}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 bg-[#1E3A8A] text-white p-4 flex justify-between items-center z-40">
        <span className="font-bold">Arrowline Admin</span>
        <button onClick={handleLogout} className="p-2">
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex-1 md:ml-64 pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
}
