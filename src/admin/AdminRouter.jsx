import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";
import AdminLogin from "../pages/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminEnquiries from "../pages/AdminEnquiries";
import AdminEnquiryDetail from "../pages/AdminEnquiryDetail";

function RequireAuth({ children }) {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    adminApi.get("/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }
  if (!auth) {
    return <Navigate to="/arrowline-admin" replace />;
  }
  return children;
}

export default function AdminRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/arrowline-admin" element={<AdminLogin />} />
        <Route
          path="/arrowline-admin"
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
        </Route>
        <Route path="*" element={<Navigate to="/arrowline-admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
