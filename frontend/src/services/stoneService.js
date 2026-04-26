import API from "../api/axios";

export const getStones = async (params = {}) => {
  const response = await API.get("/stones/", { params });
  return response.data;
};

export const getStone = async (id) => {
  const response = await API.get(`/stones/${id}/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await API.get("/categories/");
  return response.data;
};

export const getWishlist = async () => {
  const response = await API.get("/wishlist/");
  return response.data;
};

export const toggleWishlist = async (stoneId) => {
  const response = await API.post("/wishlist/toggle/", {
    stone: stoneId,
  });

  return response.data;
};

export const getPriceHistory = async (stoneId) => {
  const response = await API.get(`/stones/${stoneId}/price-history/`);
  return response.data;
};