import API from "../api/axios";

export const register = async (data) => {
  const response = await API.post("/register/", data);
  return response.data;
};

export const login = async (data) => {
  const response = await API.post("/login/", data);

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};

export const getProfile = async () => {
  const response = await API.get("/profile/");
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("access"));
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getStoredUser();
  return Boolean(user?.is_staff);
};

export const getDisplayName = () => {
  const user = getStoredUser();

  if (!user) {
    return "";
  }

  if (user.first_name) {
    return user.first_name;
  }

  if (user.full_name) {
    return user.full_name;
  }

  return user.email;
};