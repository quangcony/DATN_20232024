import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { coin, eth, logout, user, user2, wallet } from "../assets";
import { useNavigate } from "react-router";
import NoConnectWallet from "../components/NoConnectWallet";
import MutationUpdateCampaign from "../components/MutationUpdateCampaign";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, disconnect, getUserCampaigns, getBalance } =
    useStateContext();
  const [balance, setBalance] = useState("");
  const [isEdit, setIsEdit] = useState();

  //define for update campaign
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaign, setCampaign] = useState();

  const handleUpdateCampaign = (data) => {
    if (data) {
      setCampaign(data);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const getBalanceWallet = async () => {
      if (address) {
        const bal = await getBalance(address);
        const roundBal = Math.round(bal * 1000) / 1000;
        const balString = roundBal + " ETH";
        setBalance(balString);
      } else {
        setBalance("");
      }
    };
    getBalanceWallet();
  }, [address]);

  useEffect(() => {
    if (address) {
      setIsEdit(true);
    }
  }, [address]);

  const fetchCampaigns = async (account) => {
    setIsLoading(true);
    try {
      const data = await getUserCampaigns(account);
      setCampaigns(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract && address) fetchCampaigns(address);
  }, [address, contract]);

  if (!address) {
    return <NoConnectWallet />;
  }

  return (
    <>
      <div className="flex flex-col items-center my-14">
        <div className="w-32 h-32 overflow-hidden rounded-full bg-slate-500 flex items-center justify-center mb-2">
          <img src={user} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-3">
          <img src={coin} alt="" width={32} />
          <h4 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white mt-2">
            {balance}
          </h4>
        </div>
        <h4 className="font-epilogue font-semibold text-[14px] text-gray-600 my-2 break-all">
          {address}
        </h4>
        <button
          onClick={() => {
            disconnect();
            navigate("/");
          }}
          className="text-[#111111] dark:text-white flex items-center gap-2 font-semibold"
        >
          <img
            src={logout}
            width={32}
            alt="Hủy kết nối ví"
            title="Hủy kết nối ví"
          />
          Hủy kết nối đến ví
        </button>
      </div>
      {/* my campaign list */}
      <DisplayCampaigns
        title="Dự án của tôi"
        isLoading={isLoading}
        campaigns={campaigns}
        campaignsByUser={address}
        isEdit={isEdit}
        onEdit={handleUpdateCampaign}
      />

      <MutationUpdateCampaign
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={campaign}
      />
    </>
  );
};

export default Profile;
