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

const capitalizeName = (name) => {
  if (!name || typeof name !== "string") {
    return "";
  }

  const cleanName = name.trim();

  if (!cleanName) {
    return "";
  }

  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
};

export const getDisplayName = () => {
  const user = getStoredUser();

  if (!user) {
    return "";
  }

  if (user.first_name && user.first_name.trim()) {
    return capitalizeName(user.first_name);
  }

  if (user.full_name && user.full_name.trim()) {
    return capitalizeName(user.full_name.split(" ")[0]);
  }

  if (user.username && user.username.trim()) {
    return capitalizeName(user.username);
  }

  return "Customer";
};