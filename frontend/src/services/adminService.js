import API from "../api/axios";

export const createStone = async (data) => {
  const response = await API.post("/stones/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateStone = async (id, data) => {
  const response = await API.patch(`/stones/${id}/`, data);
  return response.data;
};

export const deleteStone = async (id) => {
  const response = await API.delete(`/stones/${id}/`);
  return response.data;
};

export const uploadStoneImage = async (data) => {
  const response = await API.post("/stone-images/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteStoneImage = async (id) => {
  const response = await API.delete(`/stone-images/${id}/`);
  return response.data;
};

export const createCategory = async (data) => {
  const response = await API.post("/categories/", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await API.patch(`/categories/${id}/`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/categories/${id}/`);
  return response.data;
};

export const updateOrderStatus = async (id, data) => {
  const response = await API.patch(`/orders/${id}/admin-update/`, data);
  return response.data;
};