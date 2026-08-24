import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthProvider";
import AdminLogin from "../pages/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminEnquiries from "../pages/AdminEnquiries";
import AdminEnquiryDetail from "../pages/AdminEnquiryDetail";
import AdminContent from "../pages/AdminContent";

function RequireAuth({ children }) {
  const { loading, session, configured } = useAdminAuth();

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }
  if (!configured) {
    return <div className="p-8 text-center text-red-600">Supabase Auth is not configured.</div>;
  }
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function AdminRouter() {
  return (
    <AdminAuthProvider>
    <HashRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="enquiries/:id" element={<AdminEnquiryDetail />} />
          <Route path="content" element={<AdminContent />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </HashRouter>
    </AdminAuthProvider>
  );
}
