import React, { useEffect, useState } from "react";

import { edit, tagType, trash, user } from "../assets";
import { calculateBarPercentage, daysLeft } from "../utils";
import { Popconfirm, message } from "antd";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const FundCardGrid = ({
  pId,
  owner,
  title,
  description,
  content,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
  campaignsByUser,
  isEdit,
  handleEdit,
  User,
}) => {
  const { getDonations, removeCampaign } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const checkIsDelete = async (pId) => {
    const data = await getDonations(pId);

    setIsDelete(data.length === 0);
  };

  useEffect(() => {
    checkIsDelete(pId);
  }, [pId]);

  // const handleDelete = async (pId) => {
  //   if (isDelete) {
  //     setIsLoading(true);
  //     try {
  //       await removeCampaign(pId);
  //       navigate("/");
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.log("error:", error);
  //       setIsLoading(false);
  //     }
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: "Không thể xóa với dự án đã được ủng hộ!",
  //     });
  //   }
  // };

  return (
    <>
      {contextHolder}
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="w-full group relative overflow-hidden py-[12px]">
          <div onClick={handleClick} className="cursor-pointer">
            <img
              src={image}
              alt="fund"
              className="w-full h-[170px] object-cover"
            />
          </div>

          <div className="relative h-[6px] bg-[#f2f2f2] dark:bg-[#3a3a43] -mt-[5px]">
            <div
              className="absolute h-full bg-[#009432]"
              style={{
                width: `${calculateBarPercentage(target, amountCollected)}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>

          <div className="flex flex-col p-4">
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

            <div>
              <h3
                onClick={handleClick}
                className="font-epilogue font-normal capitalize cursor-pointer text-[16px] text-[#111111] dark:text-white text-left leading-[24px] line-clamp-2"
              >
                {title}
              </h3>
              {/* <p className="mt-[30px] font-epilogue font-normal text-[#111111] dark:text-white text-left leading-[24px] line-clamp-2">
                {description}
              </p> */}
            </div>

            <div className="flex justify-between flex-wrap mt-[15px] gap-2">
              <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                Mục tiêu {target} ETH
              </p>

              <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
                {daysLeft(deadline) > 0
                  ? `Còn lại ${daysLeft(deadline)} ngày`
                  : "Hết hạn"}
              </p>
            </div>

            {/* {campaignsByUser && isEdit && (
              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center opacity-0 invisible transition-all bg-[rgba(0,0,0,0.6)] group-hover:opacity-100 group-hover:visible">
                <button
                  onClick={() => handleEdit({ pId, content, image })}
                  type="button"
                  className="w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center "
                >
                  <span>
                    <img src={edit} width={26} alt="" />
                  </span>
                </button>

                <Popconfirm
                  title="Xóa dự án này"
                  description={
                    <p className="font-epilogue font-semibold max-w-[260px]">
                      Bạn chỉ có thể thực hiện xóa với dự án chưa có ủng hộ. Và
                      không thể khôi phục lại. Đồng ý?
                    </p>
                  }
                  onConfirm={() => handleDelete(pId)}
                  okText="Có"
                  cancelText="Hủy"
                >
                  <button
                    type="button"
                    className="w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center ml-2"
                  >
                    <span>
                      <img src={trash} width={26} alt="" />
                    </span>
                  </button>
                </Popconfirm>
              </div>
            )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default FundCardGrid;
