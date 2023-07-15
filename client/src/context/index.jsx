import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useDisconnect,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { EditionMetadataWithOwnerOutputSchema } from "@thirdweb-dev/sdk";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xAa873df8782aaC82d2343fF506996a28ba233D67"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const { mutateAsync: updateCampaign } = useContractWrite(
    contract,
    "updateCampaign"
  );

  const { mutateAsync: deleteCampaign } = useContractWrite(
    contract,
    "deleteCampaign"
  );

  const { mutateAsync: createComment } = useContractWrite(
    contract,
    "createComment"
  );

  const { mutateAsync: addLike } = useContractWrite(contract, "addLike");
  const { mutateAsync: updateLike } = useContractWrite(contract, "updateLike");

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const getBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const bal = await provider.getBalance(account);
    const balInEth = ethers.utils.formatEther(bal);
    return balInEth;
  };

  const getHistoryList = async (account) => {
    let provider = new ethers.providers.EtherscanProvider("sepolia");
    let history = await provider.getHistory(account);
    return history;
  };

  const editLike = async (id, status) => {
    try {
      const newId = id - 1;
      const data = await updateLike({
        args: [newId, status],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const createLike = async (campaignId) => {
    try {
      const data = await addLike({
        args: [campaignId, address],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getLikes = async (pId) => {
    const likes = await contract.call("getLikesByCampaign", [pId]);

    const parsedLikes = likes.map((like) => ({
      id: like.id.toNumber(),
      account: like.account,
      unLike: like.unLike,
      likedAt: like.likedAt.toNumber() * 1000,
    }));

    return parsedLikes;
  };

  const addComment = async (campaignId, message) => {
    try {
      const data = await createComment({
        args: [campaignId, address, message],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getComments = async (pId) => {
    const comments = await contract.call("getCommentsByCampaign", [pId]);

    const parsedComments = comments.map((comment) => ({
      account: comment.account,
      message: comment.message,
      commentedAt: comment.commentedAt.toNumber() * 1000,
    }));

    return parsedComments;
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.content, // content
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const editCampaign = async (form) => {
    try {
      const data = await updateCampaign({
        args: [form.pId, form.content, form.image],
      });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const removeCampaign = async (pId) => {
    try {
      const data = await deleteCampaign({ args: [pId] });
      console.info("delete contract call successs", data);
    } catch (err) {
      console.error("delete contract call failure", err);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      content: campaign.content,
      isDelete: campaign.isDelete,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      likeCount: campaign.likeCount.toNumber(),
      pId: i,
    }));

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        getBalance,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getHistoryList,
        editCampaign,
        removeCampaign,
        addComment,
        getComments,
        createLike,
        getLikes,
        editLike,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
