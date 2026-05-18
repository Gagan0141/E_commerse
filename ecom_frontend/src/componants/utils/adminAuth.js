import { useAuth } from "./Auth";

export default function useAdminAuth() {
  const { auth } = useAuth();
  return {
    admin: auth.admin,
    token: auth.adminToken,
    isloggedin: !!auth.adminToken,
  };
}
