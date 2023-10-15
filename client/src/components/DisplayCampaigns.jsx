import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FundCardRow from "./FundCardRow";
import { loader } from "../assets";
import CardSkeleton from "./CardSkeleton";
import { List } from "antd";

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

  useEffect(() => {
    if (campaigns) {
      const tmp = campaigns.filter((item) => !item.isDelete);
      setData(tmp);
    }
  }, [campaigns]);

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.slug}`, { state: campaign });
  };

  return (
    <>
      {/* {title && (
        <h1 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white text-left uppercase">
          {title} ({data.length})
        </h1>
      )} */}

      {/* {isLoading && (
        <div className="flex justify-center w-full">
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )} */}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-[20px] gap-[16px]"> */}
      <div>
        {isLoading &&
          Array.from({ length: 3 }).map((s, i) => (
            <div key={i} className="mb-3">
              <CardSkeleton />
            </div>
          ))}

        {!isLoading && data.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Chưa có bất kỳ dự án nào.
          </p>
        )}

        {
          !isLoading && data.length > 0 && (
            <List
              pagination={{
                pageSize: 3,
                size: "small",
              }}
              dataSource={data}
              renderItem={(campaign) => (
                <List.Item key={campaign._id}>
                  <FundCardRow
                    {...campaign}
                    campaignsByUser={campaignsByUser}
                    isEdit={isEdit}
                    handleEdit={onEdit}
                    handleClick={() => handleNavigate(campaign)}
                  />
                </List.Item>
              )}
            />
          )
          // data.map((campaign) => (
          //   <FundCardRow
          //     key={campaign.pId}
          //     {...campaign}
          //     campaignsByUser={campaignsByUser}
          //     isEdit={isEdit}
          //     handleEdit={onEdit}
          //     handleClick={() => handleNavigate(campaign)}
          //   />
          // ))
        }
      </div>
    </>
  );
};

export default DisplayCampaigns;
