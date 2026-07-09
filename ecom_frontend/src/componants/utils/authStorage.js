const STORAGE_KEY = "multi_auth";

export function getStoredAuth() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return null;

  return JSON.parse(data);
}

export function setStoredAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function clearStoredAuthByRole(role) {
  const auth = getStoredAuth();

  if (!auth) return;

  auth[role] = null;
  auth[`${role}Token`] = null;

  setStoredAuth(auth);
}
