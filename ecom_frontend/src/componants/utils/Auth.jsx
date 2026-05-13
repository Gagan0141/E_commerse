import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(undefined);
const ROLES = ["Vendor", "Admin", "User"];

const normalizeUser = (user) => {
  if (!user) return null;

  const id = user._id || user.id;

  return {
    ...user,
    id,
    _id: id,
  };
};

const nextRoleFromUsers = (users, preferredRole) => {
  if (preferredRole && users[preferredRole]) {
    return preferredRole;
  }

  return ROLES.find((role) => users[role]) || null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState({});
  const [users, setUsers] = useState({});
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((data, makeActive = true) => {
    const role = data.user?.role;

    if (!role || !data.accessToken) {
      return null;
    }

    const currentUser = normalizeUser(data.user);

    setTokens((prev) => ({
      ...prev,
      [role]: data.accessToken,
    }));

    setUsers((prev) => ({
      ...prev,
      [role]: currentUser,
    }));

    if (makeActive) {
      setActiveRole(role);
    }

    return {
      role,
      token: data.accessToken,
      user: currentUser,
    };
  }, []);

  const clearRole = useCallback((role) => {
    setTokens((prev) => {
      const next = { ...prev };
      delete next[role];
      return next;
    });

    setUsers((prev) => {
      const next = { ...prev };
      delete next[role];

      setActiveRole((currentRole) =>
        currentRole === role ? nextRoleFromUsers(next) : currentRole,
      );

      return next;
    });
  }, []);

  const clearAuth = useCallback(() => {
    setTokens({});
    setUsers({});
    setActiveRole(null);
  }, []);

  const refresh = useCallback(
    async (role = activeRole) => {
      const res = await api.post("/api/auth/refresh", role ? { role } : {});

      if (Array.isArray(res.data.sessions)) {
        const nextTokens = {};
        const nextUsers = {};

        res.data.sessions.forEach((session) => {
          const sessionRole = session.user?.role;

          if (sessionRole && session.accessToken) {
            nextTokens[sessionRole] = session.accessToken;
            nextUsers[sessionRole] = normalizeUser(session.user);
          }
        });

        setTokens(nextTokens);
        setUsers(nextUsers);
        setActiveRole((currentRole) =>
          nextRoleFromUsers(nextUsers, currentRole),
        );

        return {
          tokens: nextTokens,
          users: nextUsers,
          role: nextRoleFromUsers(nextUsers, activeRole),
        };
      }

      return applySession(res.data, !role || role === activeRole);
    },
    [activeRole, applySession],
  );

  useEffect(() => {
    const restoreSessions = async () => {
      try {
        const res = await api.post("/api/auth/refresh", {});
        const nextTokens = {};
        const nextUsers = {};

        res.data.sessions.forEach((session) => {
          const sessionRole = session.user?.role;

          if (sessionRole && session.accessToken) {
            nextTokens[sessionRole] = session.accessToken;
            nextUsers[sessionRole] = normalizeUser(session.user);
          }
        });

        setTokens(nextTokens);
        setUsers(nextUsers);
        setActiveRole(nextRoleFromUsers(nextUsers));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSessions();
  }, [clearAuth]);

  const token = activeRole ? tokens[activeRole] : null;
  const user = activeRole ? users[activeRole] : null;

  useLayoutEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        config._authRole = activeRole;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [activeRole, token]);

  useLayoutEffect(() => {
    const refreshingByRole = {};

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const requestRole = originalRequest?._authRole || activeRole;

        if (
          status === 401 &&
          requestRole &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.url?.startsWith("/api/auth/")
        ) {
          originalRequest._retry = true;

          try {
            refreshingByRole[requestRole] =
              refreshingByRole[requestRole] || refresh(requestRole);

            const session = await refreshingByRole[requestRole];
            refreshingByRole[requestRole] = null;

            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${session.token}`;

            return api(originalRequest);
          } catch (refreshError) {
            refreshingByRole[requestRole] = null;
            clearRole(requestRole);

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [activeRole, clearRole, refresh]);

  const login = useCallback(
    async (credentials) => {
      const res = await api.post("/api/auth/login", credentials);
      const session = applySession(res.data, true);

      return {
        ...res.data,
        user: session.user,
      };
    },
    [applySession],
  );

  const logout = useCallback(
    async (role = activeRole) => {
      try {
        await api.post("/api/auth/logout", role ? { role } : {});
      } catch {
        // Local state should still clear if the server is unreachable.
      } finally {
        if (role) {
          clearRole(role);
        } else {
          clearAuth();
        }
      }
    },
    [activeRole, clearAuth, clearRole],
  );

  const switchRole = useCallback(
    (role) => {
      if (users[role]) {
        setActiveRole(role);
        return true;
      }

      return false;
    },
    [users],
  );

  const isRoleLoggedIn = useCallback(
    (role) => Boolean(users[role] && tokens[role]),
    [tokens, users],
  );

  const value = useMemo(
    () => ({
      token,
      tokens,
      user,
      users,
      activeRole,
      loading,
      login,
      logout,
      refresh,
      switchRole,
      isRoleLoggedIn,
      isAuthenticated: Boolean(token && user),
    }),
    [
      activeRole,
      isRoleLoggedIn,
      loading,
      login,
      logout,
      refresh,
      switchRole,
      token,
      tokens,
      user,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
