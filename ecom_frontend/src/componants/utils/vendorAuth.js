import { useAuth } from "./Auth";

export default function useVendorAuth() {
  const { auth } = useAuth();
  return {
    vendor: auth.vendor,
    token: auth.vendorToken,
    isloggedin: !!auth.vendorToken,
  };
}
