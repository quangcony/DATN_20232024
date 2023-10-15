import axiosClient from "./axiosClient";

const crowdfundingApi = {
  // Campaign
  getAllCampaigns: () => {
    const path = `/campaigns`;
    return axiosClient.get(path);
  },
  getCampaign: (params) => {
    const path = `/campaigns/${params}`;
    return axiosClient.get(path, params);
  },
  getFeaturedCampaign: () => {
    const path = `/campaigns/featured`;
    return axiosClient.get(path);
  },
  getCampaignsByQuery: (params) => {
    const path = `/campaigns/query`;
    return axiosClient.get(path, params);
  },
  getCampaignsByUser: (userId) => {
    const path = `/campaigns/getCampaignsByUser/${userId}`;
    return axiosClient.get(path);
  },
  createCampaign: (data) => {
    const path = `/campaigns/create`;
    return axiosClient.post(path, data);
  },
  updateCampaign: (id, data) => {
    const path = `/campaigns/${id}`;
    return axiosClient.patch(path, data);
  },

  // Recommender campaigns
  recommender: (userId) => {
    const path = `/campaigns/recommender/${userId}`;
    return axiosClient.get(path);
  },
  searchRecommender: (query) => {
    const path = `/campaigns/recommender/search?keyword=${query}`;
    return axiosClient.get(path);
  },

  // User
  auth: (data) => {
    const path = `/auth/signin`;
    return axiosClient.post(path, data);
  },
  getUser: (id) => {
    const path = `/users/${id}`;
    return axiosClient.get(path);
  },
  updateUser: (id, data) => {
    const path = `/users/${id}/edit`;
    return axiosClient.patch(path, data);
  },

  // Comment
  getCommentsByCampaign: (campaignId) => {
    const path = `/comments/${campaignId}`;
    return axiosClient.get(path);
  },
  createComment: (data) => {
    const path = `/comments/create`;
    return axiosClient.post(path, data);
  },

  // Like
  getLikesByCampaign: (campaignId) => {
    const path = `/likes/getLikesByCampaign/${campaignId}`;
    return axiosClient.get(path);
  },
  createLike: (data) => {
    const path = `/likes/create`;
    return axiosClient.post(path, data);
  },
};

export default crowdfundingApi;
