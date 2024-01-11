import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage } from "../utils";
import { heart, loader, play, profile, share, timer, user } from "../assets";
import { Avatar, Divider, List, Modal, QRCode, message } from "antd";
import { Helmet } from "react-helmet";
import { checkExpires, truncateMiddleText } from "../common";
// import ReactPlayer from "react-player/youtube";
import crowdfundingApi from "../api/crowdfundingApi";
import { CheckCircleFilled } from "@ant-design/icons";

const CampaignDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    donate,
    getDonations,
    contract,
    address,
    getCampaigns,
    connect,
    getLikes,
    getCampaign,
    updateCampaign,
    likeToCampaign,
    unlikeToCampaign,
    createLike,
    editLike,
  } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  // const [campaignLength, setCampaignLength] = useState(0);
  const [liked, setLiked] = useState(false);
  const [data, setData] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountCliked, setAmountClicked] = useState("");
  const [donateMessage, setDonateMessage] = useState("");
  const [owner, setOwner] = useState();
  const [likeList, setLikeList] = useState([]);
  const [likeListShow, setLikeListShow] = useState(false);
  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [user, setUser] = useState();
  const [likeCount, setLikeCount] = useState();

  const [messageApi, contextHolder] = message.useMessage();

  // Get campaign by slug
  const fetchCampaign = async () => {
    setIsLoadingCampaign(true);
    try {
      const campaign = await getCampaign(slug);

      setData(campaign);
      setIsLoadingCampaign(false);
    } catch (error) {
      setIsLoadingCampaign(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (slug && contract) {
      fetchCampaign();
    }
  }, [slug, contract]);

  // get like list when click the like number on screen
  const fetchLikes = async () => {
    if (data) {
      try {
        const likes = await getLikes(data._id);
        setLikeList(likes);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   const fetchCampaigns = async () => {
  //     if (data) {
  //       try {
  //         const campaigns = await getCampaigns();
  //         if (campaigns) {
  //           const campaignLength = campaigns.filter(
  //             (campaign) =>
  //               campaign?.createdBy === data.createdBy && !campaign.isDelete
  //           ).length;
  //           setCampaignLength(campaignLength);
  //         }
  //       } catch (error) {
  //         console.log("get all campaign error");
  //       }
  //     }
  //   };
  //   fetchCampaigns();
  // }, [data]);

  useEffect(() => {
    if (logged) {
      const user = JSON.parse(localStorage.getItem("profile"));
      setUser(user);
    }
  }, [logged]);

  useEffect(() => {
    if (contract && data) {
      fetchDonators();
      checkIsLiked();
    }
  }, [contract, user, data]);

  // Check isLike By Account
  const checkIsLiked = async () => {
    if (user) {
      try {
        const likes = data?.likedBy;
        const isLiked = likes.find((userId) => userId === user._id);

        setLiked(isLiked);
        setLikeCount(data.likeCount);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchDonators = async () => {
    try {
      const donators = await getDonations(data._id);
      setDonators(donators);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDonate = async () => {
    if (data) {
      if (amount > 0) {
        setIsLoading(true);
        try {
          const res = await donate(
            data._id,
            data.ownerAddress,
            amount,
            donateMessage
          );
          if (res) {
            await updateCampaign(data._id, {
              amountCollected: data.amountCollected + +amount,
            });
            fetchCampaign();
            setIsModalOpen(true);
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      } else {
        alert("Số tiền donate không hợp lệ, vui lòng kiểm tra lại!");
      }
    }
  };

  const toggleLike = async () => {
    if (data && user) {
      try {
        if (liked) {
          await editLike({ userId: user._id, campaignId: data._id });
          const res = await unlikeToCampaign({ userId: user._id }, data._id); //Remove userId from campaign likedBy
          res && messageApi.info(res.message);
          setLiked(false);
          setLikeCount((prev) => prev - 1);
        } else {
          await createLike({ userId: user._id, campaignId: data._id });
          const res = await likeToCampaign({ userId: user._id }, data._id); //Add userId to campaign likedBy
          res && messageApi.info(res.message);
          setLiked(true);
          setLikeCount((prev) => prev + 1);
        }

        // fetchCampaign();
      } catch (error) {
        console.log("Lỗi server::", error);
      }
    }
    //  else {
    //   connect();
    // }
  };

  const shareToFacebook = async () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(facebookShareUrl, "_blank");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (data) {
        try {
          const user = await crowdfundingApi.getUser(data.createdBy);
          setOwner(user);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, [data]);

  return (
    <div>
      {contextHolder}

      {isLoading && <Loader />}

      {isLoadingCampaign && (
        <div className="flex justify-center w-full mt-20">
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )}

      {data && !isLoadingCampaign && (
        <>
          <Helmet>
            <meta property="og:title" content={data.title} />
            <meta property="og:description" content={data.description} />
            <meta property="og:image" content={data.image} />
            <meta property="og:url" content={window.location.href} />
            <title>{data.title}</title>
          </Helmet>
          <div className="w-full flex md:flex-row flex-col gap-[32px]">
            <div className="flex-1 flex-col">
              <div className="relative h-[480px]">
                {/* <ReactPlayer
                  url={data?.videoUrl}
                  width={"100%"}
                  height={"100%"}
                  light={true}
                  playIcon={
                    <div className="w-[90px] h-[90px] rounded-full bg-[#007468] flex items-center justify-center border-2 border-white">
                      <img src={play} width={24} alt="Phát video" />
                    </div>
                  }
                  playing={true}
                /> */}
                {/* <img
                  src={data.image}
                  alt="campaign"
                  className="hidden dark:block w-full h-full object-cover filter blur-[60px] opacity-70 absolute left-0 top-0 ml-24 pr-24 mt-[74px] z-10"
                /> */}

                {/* <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${data?.videoId}?si=6YbPhuOf_8n63pzq&controls=0&rel=0`}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; modestbranding; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe> */}

                <img
                  src={data.image}
                  alt="campaign"
                  className="w-full h-full object-cover rounded-md absolute left-0 top-0 z-20"
                />
              </div>

              <div className="w-full mt-4">
                <ul className="list-none inline-flex gap-2 flex-wrap">
                  {data.tags.map((tag, i) => (
                    <li
                      key={i}
                      className="text-[12px] text-slate-500 font-semibold cursor-pointer"
                    >
                      <Link to={`/hashtag/${tag}`}>&#35;{tag}</Link>
                    </li>
                  ))}
                </ul>
                <h2 className="font-epilogue font-semibold text-[20px] capitalize text-[#111111] dark:text-white mt-3">
                  {data.title}
                </h2>

                <div className="relative h-[5px] bg-[#f2f2f2] dark:bg-[#3a3a43] mt-3">
                  <div
                    className="absolute h-full bg-[#009432]"
                    style={{
                      width: `${calculateBarPercentage(
                        data.target,
                        data.amountCollected
                      )}%`,
                      maxWidth: "100%",
                    }}
                  ></div>
                </div>

                <div className="flex justify-between mt-4 ">
                  <button
                    onClick={() => {
                      setLikeListShow(true);
                      fetchLikes();
                    }}
                    className="cursor-pointer hover:underline"
                  >
                    <span className="text-[#111111] dark:text-white">
                      {likeCount} lượt thích
                    </span>
                  </button>

                  {/* Like List Modal Show */}
                  <Modal
                    title="Tất cả lượt thích"
                    open={likeListShow}
                    onCancel={() => setLikeListShow(false)}
                    footer={false}
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={likeList}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.User.image} />}
                            title={
                              <Link
                                to={"https://ant.design"}
                                className="hover:underline hover:text-[#111111] dark:hover:text-white"
                              >
                                {item.User.orgName}
                              </Link>
                            }
                          />
                          <button className="px-3 py-1 bg-slate-500 text-white">
                            Theo dõi
                          </button>
                        </List.Item>
                      )}
                    />
                  </Modal>

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
                    {liked ? "Bỏ thích" : "Ủng hộ +1 tim"}
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
            </div>
            <div className="md:w-[228px] w-full">
              <div className="flex flex-wrap gap-4 md:gap-8">
                <CountBox
                  title="Thời gian còn lại"
                  value={data.deadline}
                  timer={true}
                  icon={timer}
                />
                <CountBox
                  title={`Mục tiêu ${data.target}`}
                  value={data.amountCollected}
                />
                <CountBox title="Người ủng hộ" value={donators.length} />
              </div>
            </div>
          </div>

          <div className="mt-[60px] flex lg:flex-row flex-col gap-[50px]">
            <div className="flex-[2] flex gap-4 ">
              <div className="flex-1 flex flex-col gap-[40px]">
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white uppercase">
                    Câu chuyện
                  </h4>

                  <div className="mt-[20px]">
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify line-clamp-5">
                      {data.description}
                    </p>
                  </div>

                  <div
                    className="cursor-pointer inline-block mt-2"
                    onClick={() => navigate(`/blog/${data.slug}`)}
                  >
                    <span className="text-[#111111] dark:text-white text-[14px] font-semibold transition-all hover:text-[#009432] hover:dark:text-[#009432]">
                      Xem thêm
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white uppercase">
                    Người tài trợ
                  </h4>

                  <div className="mt-[20px] flex flex-col gap-4 px-2 max-h-[360px] overflow-y-auto donation-list">
                    {donators.length > 0 ? (
                      donators.map((item, index) => (
                        <div key={`${item.donator}-${index}`}>
                          <p className="font-epilogue font-normal text-[12px] text-slate-500">
                            bởi {truncateMiddleText(item.donator)}
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="text-center">
                              <p className="font-epilogue font-semibold text-[26px] text-slate-500 leading-[26px]">
                                {item.donation}
                              </p>
                              <span className="font-epilogue font-semibold text-[12px] text-slate-500 uppercase">
                                eth
                              </span>
                            </div>
                            <p className="font-epilogue font-normal text-[14px] text-slate-500 break-ll flex-1">
                              {item.message}
                            </p>
                          </div>
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
                <div className="w-[250px] h-[500px] overflow-y-auto">
                  {/* <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white uppercase">
                    Người tạo
                  </h4> */}

                  <div className="mt-[20px] flex flex-col p-4 border border-slate-400 mb-4">
                    <Link to={`/campaigns/user/${data.user.slug}`}>
                      <div className="w-[80px] h-[80px] overflow-hidden -translate-y-10 md:w-[120px] md:h-[120px] flex items-center justify-center rounded-full cursor-pointer">
                        <img
                          src={data.user.image}
                          alt="user"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <h4 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white break-all">
                      {data.user.orgName}
                      <span className="inline-block ml-2 -translate-y-1">
                        {data.user.verified && (
                          <CheckCircleFilled
                            style={{ fontSize: 12, color: "gray" }}
                          />
                        )}
                      </span>
                    </h4>
                    <p className="mt-[4px] font-epilogue font-normal text-[14px] text-[#808191]">
                      {data.user.noCampaign} dự án
                    </p>
                    <div className="flex flex-row items-center justify-between">
                      <p className="mt-[4px] font-epilogue font-normal text-[14px] text-[#808191]">
                        Website:
                      </p>
                      <QRCode
                        errorLevel="H"
                        value={data.user.website}
                        icon={data.user.image}
                        size={80}
                        iconSize={20}
                      />
                    </div>
                  </div>

                  <p className="mt-[4px] font-epilogue font-normal dark:text-white text-[#111111]">
                    {data.user.about}
                  </p>
                </div>
            </div>

            <div className="flex-1">
              <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white uppercase">
                Qũy
              </h4>

              <div className="mt-[20px] flex flex-col p-4 bg-[#f2f2f2] dark:bg-[#1c1c24] rounded-[4px] shadow-md">
                <p className="font-epilogue font-medium text-[16px] leading-[30px] text-center text-[#808191]">
                  Tài trợ cho dự án
                </p>
                <div className="mt-[30px]">
                  <ul className="grid grid-cols-3 gap-2 mb-6">
                    {[
                      { label: "10 ETH", val: 10 },
                      { label: "25 ETH", val: 25 },
                      { label: "30 ETH", val: 30 },
                      { label: "50 ETH", val: 50 },
                      { label: "100 ETH", val: 100 },
                    ].map((item) => (
                      <li
                        key={item.label}
                        onClick={() => {
                          setAmountClicked(item.label);
                          setAmount(item.val);
                        }}
                        className={`border text-center leading-[60px] w-full h-[60px] text-[#111111] dark:text-white text-[22px] cursor-pointer ${
                          item.label === amountCliked
                            ? "border-orange-600"
                            : "border-slate-500"
                        }`}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>

                  <Divider>OR</Divider>

                  <input
                    type="number"
                    placeholder="Nhập số ETH"
                    step="0.5"
                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[4px]"
                    value={amount}
                    onChange={(e) => {
                      setAmountClicked("");
                      e.target.value >= 0
                        ? setAmount(e.target.value)
                        : setAmount("");
                    }}
                  />

                  <textarea
                    placeholder="Gửi kèm lời nhắn"
                    className="mt-4 w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[14px] leading-[30px] placeholder:text-[#4b5264] rounded-[4px]"
                    value={donateMessage}
                    onChange={(e) => setDonateMessage(e.target.value)}
                    spellCheck="false"
                  />

                  <div className="my-[20px] p-4 bg-[#d6d6d6] dark:bg-[#13131a] ">
                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-[#111111] dark:text-white">
                      Quay trở lại để theo dõi dự án này.
                    </h4>
                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[12px] text-[#808191]">
                      Ủng hộ của bạn sẽ giúp dự án hoàn thành được mục tiêu.
                    </p>
                  </div>

                  <CustomButton
                    btnType="button"
                    title={"Tài trợ cho dự án"}
                    styles={`w-full bg-[#40af65] text-white ${
                      checkExpires(data.deadline) && "lock"
                    }`}
                    handleClick={
                      address
                        ? handleDonate
                        : () => {
                            alert("Bạn chưa kết nối ví!");
                          }
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <Modal
            className="modal-show"
            style={{ textAlign: "center" }}
            centered
            width={500}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <div key="back" className="flex justify-center">
                <CustomButton
                  btnType="button"
                  title="Quay lại"
                  styles="bg-[#009432] text-white px-8"
                  handleClick={() => setIsModalOpen(false)}
                />
              </div>,
            ]}
          >
            <h2 className="font-semibold text-[24px] mb-5">Cảm ơn bạn!</h2>
            <p className="text-[14px] leading-5 mb-5 text-slate-600">
              Bạn đã ủng hộ {amount} ETH đến chiến dịch này. Số tiền này sẽ được
              thực hiện cho mục đích cộng đồng
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default CampaignDetails;
