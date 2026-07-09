import { useCallback } from "react";
import api from "../api/axios";

export default function useRoleAPI() {
  const auth = JSON.parse(localStorage.getItem("multi_auth")) || {};

  let role = null;

  if (auth.user) {
    role = "user";
  } else if (auth.vendor) {
    role = "vendor";
  } else if (auth.admin) {
    role = "admin";
  }

  const request = useCallback(
    (method, url, data = null, config = {}) => {
      return api({
        method,
        url,
        data,
        ...config,
        headers: {
          ...config.headers,
          role,
        },
      });
    },
    [role]
  );

  return {
    get: (url, config) => request("GET", url, null, config),

    post: (url, data, config) => request("POST", url, data, config),

    put: (url, data, config) => request("PUT", url, data, config),

    patch: (url, data, config) => request("PATCH", url, data, config),

    delete: (url, config) => request("DELETE", url, null, config),
  };
}