import React, { useState, useEffect } from "react";

import { CustomButton, DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { coin, logout, user2, wallet } from "../assets";
import { useNavigate } from "react-router";
import NoConnectWallet from "../components/NoConnectWallet";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const {
    address,
    contract,
    connect,
    disconnect,
    getUserCampaigns,
    getBalance,
  } = useStateContext();
  const [balance, setBalance] = useState("");

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

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  if (!address) {
    return <NoConnectWallet />;
  }

  return (
    <>
      <div className="flex flex-col items-center mb-14">
        <div className="w-32 h-32 rounded-full bg-slate-500 flex items-center justify-center">
          <img src={user2} width={80} alt="" />
        </div>
        <div className="flex">
          <img src={coin} alt="" width={32} />
          <h4 className="font-epilogue font-semibold text-[18px] text-white mt-2 ml-2">
            {balance}
          </h4>
        </div>
        <h4 className="font-epilogue font-semibold text-[14px] text-gray-600 my-2">
          {address}
        </h4>
        <button
          onClick={() => {
            disconnect();
            navigate("/");
          }}
        >
          <img
            src={logout}
            width={32}
            alt="Hủy kết nối ví"
            title="Hủy kết nối ví"
          />
        </button>
      </div>
      <DisplayCampaigns
        title="Chiến dịch của tôi"
        isLoading={isLoading}
        campaigns={campaigns}
        campaignsByUser={address}
      />
    </>
  );
};

export default Profile;
