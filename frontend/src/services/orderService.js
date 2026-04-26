import API from "../api/axios";

export const createOrder = async (data) => {
  const response = await API.post("/orders/create/", data);
  return response.data;
};

export const getOrders = async () => {
  const response = await API.get("/orders/");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await API.get(`/orders/${id}/`);
  return response.data;
};

export const updateOrderStatus = async (id, data) => {
  const response = await API.put(`/admin/orders/${id}/update/`, data);
  return response.data;
};