import { useAuth } from "./Auth";

export default function useUserAuth() {
  const { auth } = useAuth();
  return {
    user: auth.user,
    token: auth.userToken,
    isloggedin: !!auth.userToken,
  };
}
