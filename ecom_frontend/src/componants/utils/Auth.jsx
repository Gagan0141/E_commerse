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

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = getStoredAuth();
      
      if (!stored) {
        setIsInitialized(true);
        return;
      }
      
      let updatedAuth = { ...stored };
      
      try {
        // Try to refresh tokens if they exist
        if (stored.userToken) {
          try {
            const refreshRes = await api.post("/api/auth/refresh", { role: "User" }, {
              headers: {
                role: "user",
              },
            });
            updatedAuth.userToken = refreshRes.data.accessToken;
            updatedAuth.user = refreshRes.data.user;
          } catch (err) {
            // Token refresh failed, keep stored data
          }
        }
        
        if (stored.vendorToken) {
          try {
            const refreshRes = await api.post("/api/auth/refresh", { role: "Vendor" }, {
              headers: {
                role: "vendor",
              },
            });
            updatedAuth.vendorToken = refreshRes.data.accessToken;
            updatedAuth.vendor = refreshRes.data.user;
          } catch (err) {
            // Token refresh failed, keep stored data
          }
        }
        
        if (stored.adminToken) {
          try {
            const refreshRes = await api.post("/api/auth/refresh", { role: "Admin" }, {
              headers: {
                role: "admin",
              },
            });
            updatedAuth.adminToken = refreshRes.data.accessToken;
            updatedAuth.admin = refreshRes.data.user;
          } catch (err) {
            // Token refresh failed, keep stored data
          }
        }
        
        setAuth(updatedAuth);
      } catch (error) {
        setAuth(stored);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    setStoredAuth(auth);
  }, [auth, isInitialized]);

  const loginRole = (role, data, token) => {
    setAuth((pre) => ({ ...pre, [role]: data, [`${role}Token`]: token }));
  };

  const login = async (credentials) => {
    const { email, password, role } = credentials;
    const roleKey = role.toLowerCase();
    
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });
    
    loginRole(roleKey, res.data.user, res.data.accessToken);
    return res.data;
  };

  const logoutRole = async (role) => {
    await api.post("/api/auth/logout", { role });
    setAuth((pre) => {
      const updated = { ...pre, [role]: null, [`${role}Token`]: null };
      setStoredAuth(updated);
      return updated;
    });
  };

  const refreshRole = async (role) => {
    try {
      const res = await api.post("/api/auth/refresh", { role });
      setAuth((pre) => ({ ...pre, [`${role}Token`]: res.data.accessToken }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, loginRole, logoutRole, refreshRole, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}
