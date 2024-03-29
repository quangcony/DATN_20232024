import React, { useEffect, useState } from "react";

import { edit, tagType, trash, user } from "../assets";
import { calculateBarPercentage, daysLeft } from "../utils";
import { Popconfirm, Space, Tag, message } from "antd";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const FundCardRow = ({
  title,
  genres,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
  campaignsByUser,
  user,
}) => {
  const { getDonations, removeCampaign } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="w-full relative flex">
          <div onClick={handleClick} className="cursor-pointer">
            <img
              src={image}
              alt="fund"
              className="w-[176px] h-[90px] object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col pl-4">
            <div className="block">
              <h3
                onClick={handleClick}
                className="font-epilogue capitalize cursor-pointer text-[16px] text-[#111111] dark:text-white text-left leading-[26px] line-clamp-1"
              >
                {title}
              </h3>
              <div className="my-2 inline-flex">
                <p className="w-[74px]">Thể loại: </p>
                <Space size={"small"} wrap>
                  {genres?.map((genre) => (
                    <span className="border px-2 py-1 mr-[1px] rounded-full leading-none inline-block">
                      {genre}
                    </span>
                  ))}
                </Space>
              </div>
            </div>

            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#111111] dark:text-white sm:max-w-[120px] ">
              {daysLeft(deadline) > 0
                ? `Còn lại ${daysLeft(deadline)} ngày`
                : "Hết hạn"}
            </p>
            <p className="mt-[3px] font-epilogue text-[12px] text-[#111111] dark:text-white truncate">
              Bởi <span className="font-semibold">{user.orgName}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FundCardRow;
