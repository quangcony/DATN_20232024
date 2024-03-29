import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { daysLeft } from "../utils";
import { List } from "antd";

const CampaignList = ({ campaings }) => {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/campaign-details/${slug}`);
  };

  return (
    <>
      <div>
        <List
          dataSource={campaings}
          renderItem={(campaign) => (
            <List.Item key={campaign._id}>
              <div className="w-full relative flex">
                <div
                  onClick={() => handleClick(campaign.slug)}
                  className="cursor-pointer"
                >
                  <img
                    src={campaign.image}
                    alt="fund"
                    className="w-[367px] h-[187px] object-cover"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-col pl-4">
                    <div className="block">
                      <h3
                        onClick={() => handleClick(campaign.slug)}
                        className="font-epilogue font-[500] capitalize cursor-pointer text-[20px] text-[#111111] dark:text-white text-left leading-[30px]"
                      >
                        {campaign.title}
                      </h3>
                    </div>

                    <p className="mt-1 font-epilogue font-normal text-[14px] leading-[18px] text-[#111111] dark:text-white sm:max-w-[120px] ">
                      {daysLeft(campaign.deadline) > 0
                        ? `Còn lại ${daysLeft(campaign.deadline)} ngày`
                        : "Dự án đã hết hạn"}
                    </p>

                    <div className="my-2">
                      <div className="flex flex-row items-center gap-[14px]">
                        <Link to={`/campaigns/${campaign.user?.slug}`}>
                          <div className="w-[26px] h-[26px] overflow-hidden flex items-center justify-center rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] cursor-pointer">
                            <img
                              src={campaign.user?.image}
                              alt="user"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white break-all">
                          {campaign.user?.orgName || ""}
                        </h4>
                      </div>
                      <p className="mt-4 font-epilogue text-[14px] text-[#111111] dark:text-white">
                        {campaign.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default CampaignList;
