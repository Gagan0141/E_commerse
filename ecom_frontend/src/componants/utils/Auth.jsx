import { createContext, useContext, useEffect, useState } from "react";
import { getStoredAuth, setStoredAuth } from "./authStorage";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    vendor: null,
    admin: null,
    userToken: null,
    vendorToken: null,
    adminToken: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = getStoredAuth();
      if (!stored) return;
      let updatedAuth = { ...stored };
      try {
        if (stored.userToken) {
          const refreshRes = await api.post("/user/refresh");
          updatedAuth.userToken = refreshRes.data.accessToken;

          const profileRes = await api.get("/user/profile", {
            headers: {
              role: "user",
              Authorization: `Bearer ${refreshRes.data.accessToken}`,
            },
          });
          updatedAuth.user = profileRes.data;
        }
        if (stored.vendorToken) {
          const refreshRes = await api.post("/vendor/refresh");
          updatedAuth.vendorToken = refreshRes.data.accessToken;

          const profileRes = await api.get("/vendor/profile", {
            headers: {
              role: "vendor",
              Authorization: `Bearer ${refreshRes.data.accessToken}`,
            },
          });
          updatedAuth.vendor = profileRes.data;
        }
        if (stored.adminToken) {
          const refreshRes = await api.post("/admin/refresh");
          updatedAuth.adminToken = refreshRes.data.accessToken;
          const profileRes = await api.get("/admin/profile", {
            headers: {
              role: "admin",
              Authorization: `Bearer ${refreshRes.data.accessToken}`,
            },
          });
          updatedAuth.admin = profileRes.data;
        }
        setAuth(updatedAuth);
      } catch (error) {
        console.log(error);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    setStoredAuth(auth);
  }, [auth]);

  const loginRole = (role, data, token) => {
    setAuth((pre) => ({ ...pre, [role]: data, [`${role}Token`]: token }));
  };

  const login = async (credentials) => {
    const { email, password, role } = credentials;
    const roleKey = role.toLowerCase();
    
    const res = await api.post(`/${roleKey}/login`, {
      email,
      password,
    });
    
    loginRole(roleKey, res.data.user, res.data.accessToken);
    return res.data;
  };

  const logoutRole = async (role) => {
    await api.post(`/${role}/logout`);
    setAuth((pre) => {
      const updated = { ...pre, [role]: null, [`${role}Token`]: null };
      setStoredAuth(updated);
      return updated;
    });
  };

  const refreshRole = async (role) => {
    try {
      const res = await api.post(`/${role}/refresh`);
      setAuth((pre) => ({ ...pre, [`${role}Token`]: res.data.accessToken }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, loginRole, logoutRole, refreshRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
