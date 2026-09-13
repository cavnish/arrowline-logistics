import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

import {
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import adminApi from "../services/adminApi";
import { AdminAuthProvider } from "./AdminAuthProvider";

import AdminLogin from "../pages/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminEnquiries from "../pages/AdminEnquiries";
import AdminEnquiryDetail from "../pages/AdminEnquiryDetail";
import AdminServices from "../pages/AdminServices";
import AdminIndustries from "../pages/AdminIndustries";
import AdminCollection from "../pages/AdminCollection";
import AdminContent from "../pages/AdminContent";
import AdminMediaLibrary from "../pages/AdminMediaLibrary";

// =====================================================
// AUTH GUARD
// =====================================================

function RequireAuth({ children }: { children: ReactNode }) {
  const [status, setStatus] =
    useState("checking");

  useEffect(() => {
    let mounted = true;

    async function checkAuthentication() {
      try {
        const response =
          await adminApi.get("/me");

        if (
          mounted &&
          response.data?.success
        ) {
          setStatus(
            "authenticated"
          );
        } else if (mounted) {
          setStatus(
            "unauthenticated"
          );
        }
      } catch (error) {
        console.error(
          "Admin authentication check:",
          axios.isAxiosError(error)
            ? error.response?.data
            : error instanceof Error
              ? error.message
              : error
        );

        if (mounted) {
          setStatus(
            "unauthenticated"
          );
        }
      }
    }

    checkAuthentication();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // LOADING
  // ===================================================

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1E3A8A] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-medium text-slate-600">
            Checking administrator session...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // NOT AUTHENTICATED
  // ===================================================

  if (
    status ===
    "unauthenticated"
  ) {
    return (
      <Navigate
        to="/arrowline-admin/login"
        replace
      />
    );
  }

  // ===================================================
  // AUTHENTICATED
  // ===================================================

  return children;
}

// =====================================================
// ADMIN ROUTER
// =====================================================

export default function AdminRouter() {
  return (
    <AdminAuthProvider>
      <HashRouter>
        <Routes>

        {/* LOGIN */}

        <Route
          path="/arrowline-admin/login"
          element={
            <AdminLogin />
          }
        />

        {/* ADMIN APPLICATION */}

        <Route
          path="/arrowline-admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >

          {/* /arrowline-admin */}

          <Route
            index
            element={
              <Navigate
                to="/arrowline-admin/dashboard"
                replace
              />
            }
          />

          {/* DASHBOARD */}

          <Route
            path="dashboard"
            element={
              <AdminDashboard />
            }
          />

          {/* ENQUIRIES */}

          <Route
            path="enquiries"
            element={
              <AdminEnquiries />
            }
          />

          {/* ENQUIRY DETAIL */}

          <Route
            path="enquiries/:id"
            element={
              <AdminEnquiryDetail />
            }
          />

          <Route path="services" element={<AdminServices />} />
          <Route path="industries" element={<AdminIndustries />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="media" element={<AdminMediaLibrary />} />
          <Route path="case-studies" element={<AdminCollection resource="case-studies" title="Case Studies" />} />
          <Route path="gallery" element={<AdminCollection resource="gallery" title="Gallery" />} />
          <Route path="locations" element={<AdminCollection resource="locations" title="Locations" />} />
          <Route path="clients" element={<AdminCollection resource="clients" title="Clients" />} />
          <Route path="faqs" element={<AdminCollection resource="faqs" title="FAQs" />} />
          <Route path="testimonials" element={<AdminCollection resource="testimonials" title="Testimonials" />} />
          <Route path="blog-posts" element={<AdminCollection resource="blog-posts" title="Blog Posts" />} />
          <Route path="blog-categories" element={<AdminCollection resource="blog-categories" title="Blog Categories" />} />
          <Route path="social-videos" element={<AdminCollection resource="social-videos" title="Social Videos" />} />
          <Route path="statistics" element={<AdminCollection resource="statistics" title="Statistics" />} />
          <Route path="site-settings" element={<AdminCollection resource="site-settings" title="Site Settings" />} />

        </Route>

        {/* FALLBACK */}

          <Route
            path="*"
            element={
              <Navigate
                to="/arrowline-admin/login"
                replace
              />
            }
          />

        </Routes>
      </HashRouter>
    </AdminAuthProvider>
  );
}