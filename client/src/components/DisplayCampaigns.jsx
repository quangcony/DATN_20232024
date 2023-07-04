import React from "react";
import { useNavigate } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({ title, isLoading, campaigns, campaignsByUser }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div>
      {title && (
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
          {title} ({campaigns.length})
        </h1>
      )}

      {isLoading && (
        <div className="flex justify-center w-full">
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )}

      {/* <div className="flex flex-wrap mt-[20px] gap-[26px]"> */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[20px] gap-[26px]">
        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Chưa có bất kỳ chiến dịch nào.
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              campaignsByUser={campaignsByUser}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
