import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return authContext;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Runs once on app load
  // Attempts to restore access token
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setToken(response.data.accessToken);
      } catch {
        setToken(null);
      }
    };
    fetchMe();
  }, []);

  // REQUEST INTERCEPTOR
  // Automatically attaches token
  useLayoutEffect(() => {
    const authInterceptor =
      api.interceptors.request.use((config) => {
        if (!config._retry && token) {
          config.headers.Authorization =
            `Bearer ${token}`;
        }
        return config;
      });
    return () => {
      api.interceptors.request.eject(
        authInterceptor
      );
    };
  }, [token]);

  // RESPONSE INTERCEPTOR
  // Handles expired tokens automatically
  useLayoutEffect(() => {
    const refreshInterceptor =
      api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (
            error.response?.status === 403 &&
            error.response?.data?.message ===
              "Unauthorized" &&
            !originalRequest._retry
          ) {
            originalRequest._retry = true;
            try {
              // Uses refresh token cookie
              const response = await api.get(
                "/api/refreshToken"
              );
              const newAccessToken =
                response.data.accessToken;
              setToken(newAccessToken);
              originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;
              return api(originalRequest);
            } catch {
              setToken(null);
            }
          }
          return Promise.reject(error);
        }
      );
    return () => {
      api.interceptors.response.eject(
        refreshInterceptor
      );
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};