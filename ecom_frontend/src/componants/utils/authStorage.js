export const getStoredAuth = () => {
  const data = localStorage.getItem("multi_auth");
  return data ? JSON.parse(data) : null;
};

export const setStoredAuth = (data) => {
  localStorage.setItem("multi_auth", JSON.stringify(data));
};

export const clearStoredAuthByRole = (role) => {
  const data = getStoredAuth();

  if (!data) return;

  //copy
  const updatedData = { ...data };
  delete updatedData[role];

  //test for clear all
  if (Object.keys(updatedData).length === 0) {
    return clearStoredAuth();
  }

  localStorage.setItem("multi_auth", JSON.stringify(updatedData));
};

export const clearStoredAuth = () => {
  localStorage.removeItem("multi_auth");
};
