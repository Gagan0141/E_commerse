// import { useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import api from "../api/axios";

// /**
//  * Hook to make role-scoped API calls
//  * Automatically adds the x-role header based on current route
//  * Usage: const { get, post, put, delete } = useRoleAPI();
//  */
// export const useRoleAPI = () => {
//   const location = useLocation();

//   // Determine role from current route
//   const getCurrentRole = useCallback(() => {
//     const path = location.pathname;
//     if (path.startsWith("/admin")) return "Admin";
//     if (path.startsWith("/vendor")) return "Vendor";
//     if (path.startsWith("/user")) return "User";
//     return null;
//   }, [location.pathname]);

//   const makeRequest = useCallback(
//     async (method, url, data, config = {}) => {
//       const role = getCurrentRole();
//       const headers = {
//         ...config.headers,
//         "x-role": role,
//       };
//       return api({
//         method,
//         url,
//         data,
//         ...config,
//         headers,
//       });
//     },
//     [getCurrentRole]
//   );

//   return {
//     get: useCallback(
//       (url, config) => makeRequest("GET", url, undefined, config),
//       [makeRequest]
//     ),
//     post: useCallback(
//       (url, data, config) => makeRequest("POST", url, data, config),
//       [makeRequest]
//     ),
//     put: useCallback(
//       (url, data, config) => makeRequest("PUT", url, data, config),
//       [makeRequest]
//     ),
//     delete: useCallback(
//       (url, config) => makeRequest("DELETE", url, undefined, config),
//       [makeRequest]
//     ),
//     patch: useCallback(
//       (url, data, config) => makeRequest("PATCH", url, data, config),
//       [makeRequest]
//     ),
//   };
// };
