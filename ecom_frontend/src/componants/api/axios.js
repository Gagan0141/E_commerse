import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// -----------------------------
// Request Interceptor
// -----------------------------

api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("multi_auth")) || {};

    // Read either header name
    let role = config.headers?.role || config.headers?.["x-role"];

    if (role) {
      role = role.toLowerCase();

      const token = auth[`${role}Token`];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// -----------------------------
// Response Interceptor
// -----------------------------

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("/api/auth/")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    let role =
      originalRequest.headers?.role || originalRequest.headers?.["x-role"];

    if (!role) {
      return Promise.reject(error);
    }

    role = role.toLowerCase();
    
    if (!role) {
      return Promise.reject(error);
    }

    try {
      const refresh = await api.post(
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

      const auth = JSON.parse(localStorage.getItem("multi_auth")) || {};

      auth[`${role}Token`] = refresh.data.accessToken;

      localStorage.setItem("multi_auth", JSON.stringify(auth));

      originalRequest.headers.Authorization = `Bearer ${refresh.data.accessToken}`;

      return api(originalRequest);
    } catch (err) {
      const auth = JSON.parse(localStorage.getItem("multi_auth")) || {};

      auth[role] = null;
      auth[`${role}Token`] = null;

      localStorage.setItem("multi_auth", JSON.stringify(auth));

      return Promise.reject(err);
    }
  },
);

export default api;
