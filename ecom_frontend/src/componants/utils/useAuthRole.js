import { useAuth } from "./Auth";

export default function useAuthRole(role) {
  const { auth } = useAuth();

  return {
    user: auth[role],
    token: auth[`${role}Token`],
    isLoggedIn: !!auth[`${role}Token`],
  };
}