import API from "../api/axios";

export const createCategory = async (data) => {
  const response = await API.post("/categories/", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await API.put(`/categories/${id}/`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/categories/${id}/`);
  return response.data;
};

export const createStone = async (formData) => {
  const response = await API.post("/stones/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateStone = async (id, formData) => {
  const response = await API.put(`/stones/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteStone = async (id) => {
  const response = await API.delete(`/stones/${id}/`);
  return response.data;
};

export const uploadStoneImage = async (formData) => {
  const response = await API.post("/stone-images/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};