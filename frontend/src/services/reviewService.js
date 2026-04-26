import API from "../api/axios";

export const getReviews = async (stoneId) => {
  const response = await API.get(`/reviews/${stoneId}/`);
  return response.data;
};

export const createReview = async (data) => {
  const response = await API.post("/reviews/", data);
  return response.data;
};