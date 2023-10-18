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

  const { mutateAsync: donateToCampaign } = useContractWrite(
    contract,
    "donateToCampaign"
  );

  // const { mutateAsync: createCampaign } = useContractWrite(
  //   contract,
  //   "createCampaign"
  // );

  // const { mutateAsync: updateCampaign } = useContractWrite(
  //   contract,
  //   "updateCampaign"
  // );

  // const { mutateAsync: deleteCampaign } = useContractWrite(
  //   contract,
  //   "deleteCampaign"
  // );

  // const { mutateAsync: createComment } = useContractWrite(
  //   contract,
  //   "createComment"
  // );

  // const { mutateAsync: addLike } = useContractWrite(contract, "addLike");
  // const { mutateAsync: updateLike } = useContractWrite(contract, "updateLike");

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

  // const editLike = async (id, status) => {
  //   try {
  //     const data = await updateLike({
  //       args: [id, status],
  //     });

  //     console.log("contract call success", data);
  //   } catch (error) {
  //     console.log("contract call failure", error);
  //   }
  // };

  // const createLike = async (campaignId) => {
  //   try {
  //     const data = await addLike({
  //       args: [campaignId, address],
  //     });

  //     console.log("contract call success", data);
  //   } catch (error) {
  //     console.log("contract call failure", error);
  //   }
  // };

  // const getLikes = async (pId) => {
  //   const likes = await contract.call("getLikesByCampaign", [pId]);

  //   const parsedLikes = likes.map((like) => ({
  //     id: like.id.toNumber(),
  //     account: like.account,
  //     unLike: like.unLike,
  //     likedAt: like.likedAt.toNumber() * 1000,
  //   }));

  //   return parsedLikes;
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

  const publishCampaign = async (form) => {
    const data = {
      ...form,
      deadline: new Date(form.deadline).getTime(),
      target: +form.target,
    };

    await crowdfundingApi.createCampaign(data);
  };

  // const editCampaign = async (form) => {
  //   try {
  //     const newId = form.pId - 1;
  //     const data = await updateCampaign({
  //       args: [newId, form.content, form.image],
  //     });
  //     console.info("contract call successs", data);
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // };

  // const removeCampaign = async (pId) => {
  //   try {
  //     const newId = pId;
  //     const data = await deleteCampaign({ args: [newId] });
  //     console.info("delete contract call successs", data);
  //   } catch (err) {
  //     console.error("delete contract call failure", err);
  //   }
  // };

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

  const getCampaignsBySearch = async (query) => {
    const data = await crowdfundingApi.searchRecommender(query);

    return data;
  };

  // const getUserCampaigns = async (account) => {
  //   const campaigns = await contract.call("getCampaignsByAccount", [account]);

  //   const parsedCampaings = campaigns.map((campaign, i) => ({
  //     owner: campaign.owner,
  //     title: campaign.title,
  //     slug: campaign.slug,
  //     description: campaign.description,
  //     content: campaign.content,
  //     isDelete: campaign.isDelete,
  //     target: ethers.utils.formatEther(campaign.target.toString()),
  //     deadline: campaign.deadline.toNumber(),
  //     amountCollected: ethers.utils.formatEther(
  //       campaign.amountCollected.toString()
  //     ),
  //     image: campaign.image,
  //     likeCount: campaign.likeCount.toNumber(),
  //     pId: campaign.id.toNumber(),
  //   }));

  //   return parsedCampaings;
  // };

  // const getCampaignsByHashtag = async (hashtag) => {
  //   const campaigns = await contract.call("getCampaignsByHashtag", [hashtag]);

  //   const parsedCampaings = campaigns.map((campaign, i) => ({
  //     owner: campaign.owner,
  //     title: campaign.title,
  //     slug: campaign.slug,
  //     description: campaign.description,
  //     content: campaign.content,
  //     isDelete: campaign.isDelete,
  //     target: ethers.utils.formatEther(campaign.target.toString()),
  //     deadline: campaign.deadline.toNumber(),
  //     amountCollected: ethers.utils.formatEther(
  //       campaign.amountCollected.toString()
  //     ),
  //     image: campaign.image,
  //     likeCount: campaign.likeCount.toNumber(),
  //     pId: campaign.id.toNumber(),
  //   }));

  //   return parsedCampaings;
  // };

  // const getSimilarCampaigns = async (tags) => {
  //   const campaigns = await contract.call("findTopFiveSimilarCampaigns", [
  //     tags,
  //   ]);

  //   const parsedCampaings = campaigns.map((campaign, i) => ({
  //     owner: campaign.owner,
  //     title: campaign.title,
  //     slug: campaign.slug,
  //     description: campaign.description,
  //     content: campaign.content,
  //     isDelete: campaign.isDelete,
  //     target: ethers.utils.formatEther(campaign.target.toString()),
  //     deadline: campaign.deadline.toNumber(),
  //     amountCollected: ethers.utils.formatEther(
  //       campaign.amountCollected.toString()
  //     ),
  //     image: campaign.image,
  //     likeCount: campaign.likeCount.toNumber(),
  //     pId: campaign.id.toNumber(),
  //   }));

  //   return parsedCampaings;
  // };

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

  // const getDonations = async (pId) => {
  //   const donations = await contract.call("getDonators", [pId - 1]);
  //   const numberOfDonations = donations[0].length;

  //   const parsedDonations = [];

  //   for (let i = 0; i < numberOfDonations; i++) {
  //     parsedDonations.push({
  //       donator: donations[0][i],
  //       donation: ethers.utils.formatEther(donations[1][i].toString()),
  //     });
  //   }

  //   return parsedDonations;
  // };
  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);

    const parsedDonations = donations.map((donate, i) => ({
      donator: donate.donator,
      donation: ethers.utils.formatEther(donate.amount.toString()),
      message: donate.message,
    }));

    return parsedDonations;
  };

  const updateCampaign = async (id, data) => {
    const campaign = await crowdfundingApi.updateCampaign(id, data);

    return campaign;
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
        // getUserCampaigns,
        donate,
        getDonations,
        // getHistoryList,
        // editCampaign,
        // removeCampaign,
        addComment,
        getComments,
        // createLike,
        getLikes,
        // editLike,
        getCampaign,
        getRecommendData,
        // getCampaignsByHashtag,
        // getSimilarCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
