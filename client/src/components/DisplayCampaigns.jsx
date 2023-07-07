import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FundCard from "./FundCard";
import { loader } from "../assets";

const DisplayCampaigns = ({
  title,
  isLoading,
  campaigns,
  campaignsByUser,
  isEdit,
  onEdit,
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [active, setActive] = useState("Tất cả");

  useEffect(() => {
    if (campaigns) {
      const tmp = campaigns.filter((item) => !item.isDelete);
      setData(tmp);
    }
  }, [campaigns]);

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div className="mt-[20px]">
      <div className="flex overflow-x-auto gap-3 mb-6">
        {["Tất cả", "Gây quỹ", "Khởi nghiệp", "Đầu tư"].map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(item)}
            className={`px-4 py-2 rounded-md leading-none ${
              item === active
                ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                : "bg-[#f2f2f2] dark:bg-[#2c2f32] text-[#111111] dark:text-white "
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {title && (
        <h1 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white text-left">
          {title} ({data.length})
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
        {!isLoading && data.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Chưa có bất kỳ dự án nào.
          </p>
        )}

        {!isLoading &&
          data.length > 0 &&
          data.map((campaign) => (
            <FundCard
              key={campaign.pId}
              {...campaign}
              campaignsByUser={campaignsByUser}
              isEdit={isEdit}
              handleEdit={onEdit}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
