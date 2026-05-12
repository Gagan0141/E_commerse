import api from "../api/axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  users: {},
  loading: true,
  login: async () => {},
  logout: async () => {},
  logoutRole: async () => {},
  refresh: async () => {},
  isRoleLoggedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [users, setusers] = useState({});
  const [loading, setloading] = useState(true);

  const isRoleLoggedIn = (role) => {
    return !!users[role];
  };

  // Refresh all available sessions
  const refresh = async () => {
    setloading(true);

    try {
      const loggedInUsers = {};
      const roles = ["Admin", "Vendor", "User"];

      for (const role of roles) {
        try {
          const res = await api.get("/api/auth/me", {
            params: { role },
            withCredentials: true,
          });

          loggedInUsers[role] = res.data;
        } catch (err) {
          // role not logged in, ignore
        }
      }

      setusers(loggedInUsers);

      const activeRole = localStorage.getItem("activeRole");

      // Restore active role if still valid
      if (activeRole && loggedInUsers[activeRole]) {
        setuser(loggedInUsers[activeRole]);
        localStorage.setItem("loggedin", "true");
      } else {
        // Fallback to first available logged-in role
        const fallbackRole = Object.keys(loggedInUsers)[0];

        if (fallbackRole) {
          setuser(loggedInUsers[fallbackRole]);
          localStorage.setItem("activeRole", fallbackRole);
          localStorage.setItem("loggedin", "true");
        } else {
          setuser(null);
          localStorage.removeItem("activeRole");
          localStorage.removeItem("loggedin");
        }
      }
    } catch (err) {
      console.error("Error refreshing user sessions:", err);

      setuser(null);
      setusers({});

      localStorage.removeItem("activeRole");
      localStorage.removeItem("loggedin");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Login into one role (preserves other role sessions)
  const login = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      const newUser = res.data.user;
      const role = newUser.role;

      localStorage.setItem("activeRole", role);
      localStorage.setItem("loggedin", "true");

      setusers((prev) => ({
        ...prev,
        [role]: newUser,
      }));

      setuser(newUser);

      return res;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  // Logout only one role
  const logoutRole = async (role) => {
    try {
      await api.post("/api/auth/logout", { role }, { withCredentials: true });

      const updatedUsers = { ...users };
      delete updatedUsers[role];

      setusers(updatedUsers);

      // If current active user logged out, switch to another available role
      if (user?.role === role) {
        const remainingRoles = Object.keys(updatedUsers);

        if (remainingRoles.length > 0) {
          const nextRole = remainingRoles[0];

          localStorage.setItem("activeRole", nextRole);
          setuser(updatedUsers[nextRole]);
        } else {
          setuser(null);
          localStorage.removeItem("activeRole");
          localStorage.removeItem("loggedin");
        }
      }
    } catch (err) {
      console.error(`Logout error for ${role}:`, err);
      throw err;
    }
  };

  // Logout all roles
  const logout = async () => {
    try {
      const roles = Object.keys(users);

      for (const role of roles) {
        try {
          await api.post("/api/auth/logout", { role }, { withCredentials: true });
        } catch (err) {
          console.error(`Error logging out from ${role}:`, err);
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setuser(null);
      setusers({});

      localStorage.removeItem("activeRole");
      localStorage.removeItem("loggedin");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        logout,
        logoutRole,
        refresh,
        isRoleLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
