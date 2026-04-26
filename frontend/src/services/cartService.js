import API from "../api/axios";

export const getCart = async () => {
  const response = await API.get("/cart/");
  return response.data;
};

export const addToCart = async (stoneId, quantity = 1) => {
  const response = await API.post("/cart/add/", {
    stone_id: stoneId,
    quantity,
  });

  return response.data;
};

export const removeFromCart = async (stoneId) => {
  const response = await API.delete("/cart/remove/", {
    data: {
      stone_id: stoneId,
    },
  });

  return response.data;
};