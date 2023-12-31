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
  getCampaignsByTag: (tag) => {
    const path = `/campaigns/getCampaignsByTag/${tag}`;
    return axiosClient.get(path);
  },
  getCampaignsByUser: (slug) => {
    const path = `/campaigns/getCampaignsByUser/${slug}`;
    return axiosClient.get(path);
  },
  getCampaignsByGenre: (query) => {
    const path = `/campaigns/getCampaignsByGenre?genre=${query}`;
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
  likeToCampaign: (userId, campaignId) => {
    const path = `/campaigns/${campaignId}/like`;
    return axiosClient.patch(path, userId);
  },
  unlikeToCampaign: (userId, campaignId) => {
    const path = `/campaigns/${campaignId}/unlike`;
    return axiosClient.patch(path, userId);
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
  getRelatedCampaings: (id) => {
    const path = `/campaigns/recommender/related/${id}`;
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
  updateLike: (data) => {
    const path = `/likes/update`;
    return axiosClient.patch(path, data);
  },
};

export default crowdfundingApi;
