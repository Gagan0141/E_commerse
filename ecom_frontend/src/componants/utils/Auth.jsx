import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getStoredAuth, setStoredAuth } from "./authStorage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const initialState = {
  user: null,
  vendor: null,
  admin: null,

  userToken: null,
  vendorToken: null,
  adminToken: null,
};

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // -------------------------
  // Restore login on refresh
  // -------------------------
  useEffect(() => {
    const restoreSession = async () => {
      const stored = getStoredAuth();

      if (!stored) {
        setIsInitialized(true);
        return;
      }

      let updated = { ...stored };

      for (const role of ["user", "vendor", "admin"]) {
        if (!stored[`${role}Token`]) continue;

        try {
          const res = await api.post(
            "/api/auth/refresh",
            {
              role: role.charAt(0).toUpperCase() + role.slice(1),
            },
            {
              headers: {
                role,
              },
            },
          );

          updated[role] = res.data.user;
          updated[`${role}Token`] = res.data.accessToken;
        } catch (err) {
          updated[role] = null;
          updated[`${role}Token`] = null;
        }
      }

      setAuth(updated);
      setIsInitialized(true);
    };

    restoreSession();
  }, []);

  // -------------------------
  // Save auth to localStorage
  // -------------------------

  useEffect(() => {
    if (!isInitialized) return;
    setStoredAuth(auth);
  }, [auth, isInitialized]);

  // -------------------------
  // Login
  // -------------------------

  const login = async ({ email, password, role }) => {
    const roleKey = role.toLowerCase();

    const res = await api.post(
      "/api/auth/login",
      {
        email,
        password,
        role,
      },
      {
        headers: {
          role: roleKey,
        },
      },
    );

    setAuth((prev) => ({
      ...prev,
      [roleKey]: res.data.user,
      [`${roleKey}Token`]: res.data.accessToken,
    }));

    return res.data;
  };

  // -------------------------
  // Logout
  // -------------------------

  const logoutRole = async (role) => {
    const roleKey = role.toLowerCase();

    await api.post(
      "/api/auth/logout",
      { role },
      {
        headers: {
          role: roleKey,
        },
      },
    );

    setAuth((prev) => ({
      ...prev,
      [roleKey]: null,
      [`${roleKey}Token`]: null,
    }));
  };

  // -------------------------
  // Refresh Token
  // -------------------------

  const refreshToken = async (role) => {
    const roleKey = role.toLowerCase();

    const res = await api.post(
      "/api/auth/refresh",
      {
        role,
      },
      {
        headers: {
          role: roleKey,
        },
      },
    );

    setAuth((prev) => ({
      ...prev,
      [`${roleKey}Token`]: res.data.accessToken,
    }));

    return res.data.accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        login,
        logoutRole,
        refreshToken,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
