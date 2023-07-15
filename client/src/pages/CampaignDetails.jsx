import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage } from "../utils";
import { heart, share, timer, user } from "../assets";
import { Helmet } from "react-helmet";

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const {
    donate,
    getDonations,
    contract,
    address,
    getCampaigns,
    connect,
    createLike,
    getLikes,
    editLike,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [campaignLength, setCampaignLength] = useState(0);
  const [liked, setLiked] = useState(false);

  // Check isLike By Account
  const checkIsLiked = async () => {
    if (state) {
      try {
        const data = await getLikes(state.pId);
        const isLiked = data.find(
          (like) => like.account === address && !like.unLike
        );

        setLiked(isLiked);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        if (data) {
          const campaignLength = data.filter(
            (campaign) => campaign.owner === state.owner && !campaign.isDelete
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
    if (contract) {
      fetchDonators();
      checkIsLiked();
    }
  }, [contract, address]);

  const handleDonate = async () => {
    if (state) {
      if (amount > 0) {
        setIsLoading(true);
        try {
          await donate(state.pId, amount);
          navigate("/");
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
        }
      } else {
        alert("Số tiền donate không hợp lệ, vui lòng kiểm tra lại!");
      }
    }
  };

  const toggleLike = async () => {
    try {
      const data = await getLikes(state.pId);
      const isLiked = data.find((like) => like.account === address);

      if (!liked) {
        if (isLiked) {
          console.log("Đã like trước đó => sửa unlike = false");
          await editLike(isLiked.id, false);
        } else {
          console.log("Tạo mới 1 like");
          await createLike(state.pId);
        }
      } else {
        console.log("Bỏ thích => sửa unlike = true");
        await editLike(isLiked.id, true);
      }
    } catch (error) {
      console.log("like failed::", error);
    }

    setLiked(!liked);
  };

  const shareToFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      "https://datn-20232024-3jkppaczx-quangcony.vercel.app/"
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  return (
    <div className="-ml-10 -mt-[72px]">
      {isLoading && <Loader />}
      <Helmet>
        <title>{state.title}</title>
        <meta name="description" content={state.description} />
        <meta name="image" content={state.image} />
      </Helmet>

      <div className="w-full flex md:flex-row flex-col ">
        <div className="flex-1 flex-col">
          <div className="relative h-[410px]">
            <img
              src={state.image}
              alt="campaign"
              className="hidden dark:block w-full h-full object-cover filter blur-[60px] opacity-60 absolute left-0 top-0 ml-24 pr-28 mt-[72px] z-10"
            />

            <img
              src={state.image}
              alt="campaign"
              className="ml-10 pr-10 mt-[72px] w-full h-full object-cover rounded-md absolute left-0 top-0 z-20"
            />
          </div>

          <h2 className="pl-10 mt-[calc(72px+16px)] font-epilogue font-semibold text-[20px] capitalize text-[#111111] dark:text-white">
            {state.title}
          </h2>

          <div className="ml-10 relative max-w-[100%-40px] h-[5px] bg-[#f2f2f2] dark:bg-[#3a3a43] mt-2">
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

          <div className="flex justify-between mt-4 pl-10">
            <span className="text-[#111111] dark:text-white">
              {state.likeCount} lượt thích
            </span>

            <button
              onClick={toggleLike}
              type="button"
              className={`flex items-center font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white ${
                liked ? "grayscale-0" : "grayscale"
              }  hover:grayscale-0`}
            >
              <span className="mr-2 -mt-1">
                <img src={heart} width={18} alt="" />
              </span>
              Ủng hộ +1 tim
            </button>
            <button
              type="button"
              className="flex items-center text-[#111111] dark:text-white"
              onClick={shareToFacebook}
            >
              <span className="mr-2 dark:brightness-100">
                <img src={share} width={18} alt="" />
              </span>
              Chia sẻ
            </button>
          </div>
        </div>

        <div className="flex ml-[30px] mt-[72px] md:w-[150px] w-full flex-wrap justify-between gap-[16px]">
          <CountBox
            title="Ngày còn lại"
            value={state.deadline}
            timer={true}
            icon={timer}
          />
          <CountBox
            title={`Mục tiêu ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Người ủng hộ" value={donators.length} />
        </div>
      </div>

      <div className="pl-10 mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
              Người tạo
            </h4>

            <div className="mt-[20px] flex flex-row items-center gap-[14px]">
              <Link to={`/campaigns/${state.owner}`}>
                <div className="w-[40px] h-[40px] md:w-[52px] md:h-[52px] flex items-center justify-center rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] cursor-pointer">
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
                  {campaignLength} dự án
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[16px] text-[#111111] dark:text-white uppercase">
              Về dự án
            </h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify line-clamp-5">
                {state.description}
              </p>
            </div>

            <div
              className="cursor-pointer inline-block mt-2"
              onClick={() => navigate(`/blog/${state.title}`, { state: state })}
            >
              <span className="text-[#111111] dark:text-white font-semibold transition-all hover:text-[#EA2027] hover:dark:text-[#EA2027]">
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
                    className="flex justify-between items-center gap-4 flex-wrap"
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

          <div className="mt-[20px] flex flex-col p-4 bg-[#f2f2f2] dark:bg-[#1c1c24] rounded-[10px] shadow-md">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Tài trợ cho dự án
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => {
                  e.target.value >= 0
                    ? setAmount(e.target.value)
                    : setAmount("");
                }}
              />

              <div className="my-[20px] p-4 bg-[#d6d6d6] dark:bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-[#111111] dark:text-white">
                  Quay trở lại để theo dõi dự án này.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Hỗ trợ dự án mà không cần phần thưởng, chúc bạn thật nhiều sức
                  khỏe.
                </p>
              </div>

              <CustomButton
                btnType="button"
                // title={
                //   !isExpired ? "Tài trợ cho dự án" : "Sự kiện này đã kết thúc"
                // }
                // styles={
                //   !isExpired
                //     ? "w-full bg-[#8c6dfd]"
                //     : "w-full bg-[#EA2027] opacity-75 pointer-events-none"
                // }
                title={address ? "Tài trợ cho dự án" : "Kết nối ví"}
                styles={"w-full bg-[#8c6dfd] text-white"}
                handleClick={address ? handleDonate : connect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
