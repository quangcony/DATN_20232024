import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useDisconnect,
  useCoinbaseWallet,
  useTrustWallet,
  useWalletConnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import crowdfundingApi from "../api/crowdfundingApi";
// import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Sepolia } from "@thirdweb-dev/chains";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // const sdk = new ThirdwebSDK(Sepolia, {
  //   clientId: "593873c304c15eb662af3880f6d0f0c1",
  // });

  // const contract = sdk.getContract(
  //   "0x3c61C73666B6878a62A299c26262096435b90ec2"
  // );
  const { contract } = useContract(
    "0x0b75728a4cDc00B76dd4eB7c288F672dF80c0217",
    import.meta.env.VITE_ABI
  );

  const address = useAddress();
  const connect = useMetamask();
  const connectWithCoinbase = useCoinbaseWallet();
  const connectWithTrust = useTrustWallet();
  const connectWithWalletConnect = useWalletConnect();
  const disconnect = useDisconnect();

  const getBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const bal = await provider.getBalance(account);
    const balInEth = ethers.utils.formatEther(bal);
    return balInEth;
  };

  // const getHistoryList = async (account) => {
  //   let provider = new ethers.providers.EtherscanProvider("sepolia");
  //   let history = await provider.getHistory(account);
  //   return history;
  // };

  // COMMENT
  const addComment = async (campaignId, userId, message) => {
    const data = {
      campaignId: campaignId,
      userId: userId,
      message: message,
    };
    await crowdfundingApi.createComment(data);
  };

  const getComments = async (campaignId) => {
    const comments = await crowdfundingApi.getCommentsByCampaign(campaignId);

    return comments;
  };

  // LIKE
  const getLikes = async (campaignId) => {
    const likes = await crowdfundingApi.getLikesByCampaign(campaignId);

    return likes;
  };

  // CAMPAIGNS
  const publishCampaign = async (form) => {
    const data = {
      ...form,
      deadline: new Date(form.deadline).getTime(),
      target: +form.target,
    };

    await crowdfundingApi.createCampaign(data);
  };

  const getCampaigns = async (query) => {
    let campaigns = [];
    campaigns = await crowdfundingApi.getAllCampaigns();
    if (query)
      campaigns = campaigns.filter((campaign) => campaign._id !== query);

    return campaigns;
  };

  const getCampaign = async (slug) => {
    const campaign = await crowdfundingApi.getCampaign(slug);

    return campaign;
  };

  const getFeaturedCampaign = async () => {
    const campaign = await crowdfundingApi.getFeaturedCampaign();

    return campaign;
  };

  const getCampaignsByTag = async (tag) => {
    const campaigns = await crowdfundingApi.getCampaignsByTag(tag);

    return campaigns;
  };

  const getCampaignsByUser = async (slug) => {
    const campaigns = await crowdfundingApi.getCampaignsByUser(slug);

    return campaigns;
  };

  const getRecommendData = async (userId) => {
    const data = await crowdfundingApi.recommender(userId);

    return data;
  };

  const getRelatedCampaings = async (campaignId) => {
    const data = await crowdfundingApi.getRelatedCampaings(campaignId);

    return data;
  };

  const getCampaignsBySearch = async (query) => {
    const data = await crowdfundingApi.searchRecommender(query);

    return data;
  };

  const updateCampaign = async (id, data) => {
    const campaign = await crowdfundingApi.updateCampaign(id, data);

    return campaign;
  };

  const likeToCampaign = async (userId, campaignId) => {
    const like = await crowdfundingApi.likeToCampaign(userId, campaignId);

    return like;
  };

  const unlikeToCampaign = async (userId, campaignId) => {
    const like = await crowdfundingApi.unlikeToCampaign(userId, campaignId);

    return like;
  };

  // DONATE
  const donate = async (campaignId, address, amount, message) => {
    const data = await contract.call(
      "donateToCampaign",
      [campaignId, address, message],
      {
        value: ethers.utils.parseEther(amount),
      }
    );

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);

    const parsedDonations = donations.map((donate, i) => ({
      donator: donate.donator,
      donation: ethers.utils.formatEther(donate.amount.toString()),
      message: donate.message,
    }));

    return parsedDonations;
  };

  // LIKE
  const createLike = async (data) => {
    const like = await crowdfundingApi.createLike(data);

    return like;
  };

  const editLike = async (data) => {
    const like = await crowdfundingApi.updateLike(data);

    return like;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        connectWithCoinbase,
        connectWithTrust,
        connectWithWalletConnect,
        disconnect,
        getBalance,
        createCampaign: publishCampaign,
        getCampaigns,
        getFeaturedCampaign,
        getCampaignsByTag,
        getCampaignsByUser,
        getCampaignsBySearch,
        updateCampaign,
        likeToCampaign,
        unlikeToCampaign,
        // getUserCampaigns,
        donate,
        getDonations,
        // getHistoryList,
        // editCampaign,
        // removeCampaign,
        addComment,
        getComments,
        getLikes,
        createLike,
        editLike,
        getCampaign,
        getRecommendData,
        // getCampaignsByHashtag,
        getRelatedCampaings,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
