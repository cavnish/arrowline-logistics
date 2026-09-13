import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Inbox,
  BriefcaseBusiness,
  Factory,
  Files,
  Images,
  MapPin,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Video,
  BarChart3,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

import adminApi from "../../services/adminApi";

const sidebarLinks = [
  {
    to: "/arrowline-admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/arrowline-admin/enquiries",
    label: "Enquiries",
    icon: Inbox,
  },
  {
    to: "/arrowline-admin/services",
    label: "Services",
    icon: BriefcaseBusiness,
  },
  {
    to: "/arrowline-admin/industries",
    label: "Industries",
    icon: Factory,
  },
  {
    to: "/arrowline-admin/content",
    label: "Website Content",
    icon: Files,
  },
  {
    to: "/arrowline-admin/media",
    label: "Media Library",
    icon: Images,
  },
  { to: "/arrowline-admin/case-studies", label: "Case Studies", icon: Files },
  { to: "/arrowline-admin/gallery", label: "Gallery", icon: Images },
  { to: "/arrowline-admin/locations", label: "Locations", icon: MapPin },
  { to: "/arrowline-admin/clients", label: "Clients", icon: Users },
  { to: "/arrowline-admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/arrowline-admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/arrowline-admin/blog-posts", label: "Blog Posts", icon: Newspaper },
  { to: "/arrowline-admin/blog-categories", label: "Blog Categories", icon: Newspaper },
  { to: "/arrowline-admin/social-videos", label: "Social Videos", icon: Video },
  { to: "/arrowline-admin/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/arrowline-admin/site-settings", label: "Site Settings", icon: Settings },
];

export default function AdminLayout() {
  const navigate =
    useNavigate();

  async function handleLogout() {
    try {
      await adminApi.post(
        "/logout"
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      navigate(
        "/arrowline-admin/login",
        {
          replace: true,
        }
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ============================================
          DESKTOP SIDEBAR
      ============================================ */}

      <aside className="w-64 bg-[#1E3A8A] text-white hidden md:flex flex-col fixed inset-y-0 left-0 z-30">

        {/* BRAND */}

        <div className="p-6 border-b border-blue-800/50">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#FF7A00] flex items-center justify-center">
              <span className="text-lg font-black">
                AL
              </span>
            </div>

            <div>
              <div className="text-sm font-bold">
                Arrowline
              </div>

              <div className="text-xs text-blue-200">
                Admin Portal
              </div>
            </div>

          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 py-6">

          {sidebarLinks.map(
            (link) => {
              const Icon =
                link.icon;

              return (
                <NavLink
                  key={
                    link.to
                  }
                  to={
                    link.to
                  }
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/10 border-r-4 border-[#FF7A00] text-white"
                        : "text-blue-100 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />

                  <span>
                    {
                      link.label
                    }
                  </span>
                </NavLink>
              );
            }
          )}

        </nav>

        {/* LOGOUT */}

        <div className="p-4 border-t border-blue-800/50">

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-blue-100 hover:bg-white/10 hover:text-white transition"
          >
            <LogOut
              size={18}
            />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* ============================================
          MOBILE HEADER
      ============================================ */}

      <div className="md:hidden fixed top-0 inset-x-0 bg-[#1E3A8A] text-white px-4 py-3 flex justify-between items-center z-40 shadow-lg">

        <div>
          <div className="font-bold">
            Arrowline Admin
          </div>

          <div className="text-[10px] text-blue-200">
            Management Portal
          </div>
        </div>

        <button
          type="button"
          onClick={
            handleLogout
          }
          className="p-2 rounded-lg hover:bg-white/10"
          aria-label="Logout"
        >
          <LogOut
            size={20}
          />
        </button>

      </div>

      {/* ============================================
          CONTENT
      ============================================ */}

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}