import React from "react";
import { calculateBarPercentage } from "../utils";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const HorizontalItem = ({ item }) => {
  if (!item) return <Loading />;
  console.log(item);
  return (
    <div>
      <div className="w-full group relative overflow-hidden">
        <Link to={`/campaign-details/${item.slug}`}>
          <img
            src={item.image}
            alt="fund"
            className="w-full h-[165px] object-cover"
          />
        </Link>

        <div className="relative h-[6px] bg-[#f2f2f2] dark:bg-[#3a3a43] -mt-[5px]">
          <div
            className="absolute h-full bg-[#009432]"
            style={{
              width: `${calculateBarPercentage(
                item.target,
                item.amountCollected
              )}%`,
              maxWidth: "100%",
            }}
          ></div>
        </div>

        <div className="flex flex-col mt-4">
          {/* <div className="flex flex-row items-center mb-[18px]">
            <img
              src={tagType}
              alt="tag"
              className="w-[17px] h-[17px] object-contain"
            />
            <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
              Gây quỹ
            </p>
          </div> */}

          <div className="block">
            <h3 className="font-epilogue h-[60px] font-normal capitalize cursor-pointer text-[16px] text-[#111111] dark:text-white text-left leading-[28px] line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-[16px] text-[14px] font-epilogue text-[#111111] dark:text-white leading-[24px] line-clamp-6">
              {item.description}
            </p>
          </div>

          <div className="flex justify-between flex-wrap mt-[15px] gap-2">
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              {/* Mục tiêu {target} ETH */}
            </p>

            {/* <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              {daysLeft(deadline) > 0
                ? `Còn lại ${daysLeft(deadline)} ngày`
                : "Hết hạn"}
            </p> */}
          </div>
          <div className="flex items-center mt-[20px] gap-[12px]">
            <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
              Bởi <span className="font-semibold">{item.user?.orgName}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalItem;
