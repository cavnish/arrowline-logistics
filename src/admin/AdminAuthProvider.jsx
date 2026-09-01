import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import adminApi from "../services/adminApi";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = useMemo(
    () => ({
      session,
      user: session,
      loading,
      configured: true,

      signIn: async (email, password) => {
        const cleanEmail = email
          .trim()
          .toLowerCase();

        if (!cleanEmail || !password) {
          return {
            success: false,
            message:
              "Admin email and password are required.",
          };
        }

        try {
          const { data } = await adminApi.post("/login", {
            email: cleanEmail,
              password,
          });

          setSession({ authenticated: true });

          return {
            success: true,
            data,
          };
        } catch (error) {
          console.error(
            "Admin sign-in exception:",
            error?.response?.data || error
          );

          return {
            success: false,
            message:
              error?.response?.data?.message ||
              "Unable to sign in. Please try again.",
          };
        }
      },

      signOut: async () => {
        try {
          await adminApi.post("/logout");
        } catch (error) {
          console.error(
            "Logout exception:",
            error
          );
        } finally {
          setSession(null);
        }
      },
    }),
    [session, loading]
  );

  useEffect(() => {
    adminApi
      .get("/me")
      .then(() => setSession({ authenticated: true }))
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider"
    );
  }

  return context;
}