import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { donateIcon, user } from "../assets";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, getCampaigns } =
    useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [campaignLength, setCampaignLength] = useState(0);

  const remainingDays = daysLeft(state.deadline);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        if (data) {
          const campaignLength = data.filter(
            (campaign) => campaign.owner === state.owner
          ).length;
          setCampaignLength(campaignLength);
        }
      } catch (error) {
        console.log("get all campaign error");
      }
    };
    fetchCampaigns();
  }, [state]);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);

    setDonators(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);

    navigate("/");
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <h2 className="font-epilogue font-semibold text-[20px] capitalize text-[#111111] dark:text-white mb-4">
            {state.title}
          </h2>
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-md"
          />
          <div className="relative w-full h-[5px] bg-[#f2f2f2] dark:bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#EA2027]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox
            title="Ngày còn lại"
            value={remainingDays <= 0 ? 0 : remainingDays}
          />
          <CountBox
            title={`Mục tiêu ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Tổng số người ủng hộ" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
              Người tạo
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <Link to={`/campaigns/${state.owner}`}>
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] cursor-pointer">
                  <img
                    src={user}
                    alt="user"
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
              </Link>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  {campaignLength} chiến dịch
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
              Về chiến dịch
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => navigate(`/blog/${state.title}`, { state: state })}
            >
              <span className="text-[#111111] dark:text-white font-semibold transition-all hover:text-[#EA2027]">
                Xem thêm
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
              Người tài trợ
            </h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  Chưa có nhà tài trợ nào. Hãy là người đầu tiên!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
            Quỹ
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#f2f2f2] dark:bg-[#1c1c24] rounded-[10px] shadow-xl">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Tài trợ cho chiến dịch
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#d6d6d6] dark:bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-[#111111] dark:text-white">
                  Quay trở lại để theo dõi chiến dịch này.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Hỗ trợ dự án mà không cần phần thưởng, chúc bạn thật nhiều sức
                  khỏe.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title={
                  remainingDays >= 0
                    ? "Tài trợ cho chiến dịch"
                    : "Sự kiện này đã kết thúc"
                }
                icon={donateIcon}
                styles={
                  remainingDays >= 0
                    ? "w-full bg-[#8c6dfd]"
                    : "w-full bg-[#EA2027] opacity-75 pointer-events-none"
                }
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
