// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,
// });

// // REQUEST INTERCEPTOR
// api.interceptors.request.use((config) => {
//   const role = config.headers?.["x-role"];

//   if (role) {
//     const token = localStorage.getItem(`accessToken_${role}`);

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// // RESPONSE INTERCEPTOR
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/api/auth/")
//     ) {
//       originalRequest._retry = true;

//       const role = originalRequest.headers?.["x-role"];

//       if (!role) {
//         return Promise.reject(error);
//       }

//       try {
//         const refreshRes = await api.post(
//           "/api/auth/refresh",
//           { role },
//           {
//             headers: {
//               "x-role": role,
//             },
//           },
//         );

//         const newAccessToken = refreshRes.data.accessToken;

//         localStorage.setItem(`accessToken_${role}`, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem(`accessToken_${role}`);

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("multi_auth"));

  const role = config.headers.role;

  if (role === "user" && auth?.userToken) {
    config.headers.Authorization = `Bearer${auth.userToken}`;
  }
  if (role === "vendor" && auth?.vendorToken) {
    config.headers.Authorization = `Bearer${auth.vendorToken}`;
  }
  if (role === "admin" && auth?.adminToken) {
    config.headers.Authorization = `Bearer${auth.adminToken}`;
  }
  return config;
});

export default api;
