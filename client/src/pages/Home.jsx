import React, { useState, useEffect } from "react";

import { DisplayCampaigns, FundCard } from "../components";
import { useStateContext } from "../context";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import HorizontalList from "../components/HorizontalList";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsByEducation, setCampaignsByEducation] = useState([]);
  const [mainCampaign, setMainCampaign] = useState();

  // const [active, setActive] = useState("Tất cả");

  const {
    address,
    contract,
    getCampaigns,
    getFeaturedCampaign,
    getCampaignsByQuery,
  } = useStateContext();

  useEffect(() => {
    const fetchFeaturedCampaign = async () => {
      try {
        const data = await getFeaturedCampaign();

        setMainCampaign(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFeaturedCampaign();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async (query) => {
      setIsLoading(true);
      try {
        const data = await getCampaigns(query);
        const campainsByEducation = await getCampaignsByQuery(
          {
            category: "education",
          },
          query
        );
        setCampaignsByEducation(campainsByEducation);
        setCampaigns(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    if (mainCampaign) fetchCampaigns(mainCampaign._id);
  }, [mainCampaign]);

  return (
    <div>
      <Helmet>
        <title>Vietnamese | Together we can change the world</title>
      </Helmet>
      {/* <div className="flex w-full overflow-x-auto gap-3 mb-4 pb-4 scroll-container pr-[30px]">
        {[
          "Tất cả",
          "Gây quỹ",
          "Khởi nghiệp",
          "Đầu tư",
          "Trò chơi",
          "Ẩm thực",
          "Công nghệ",
          "Truyện tranh",
          "Phim",
          "Âm nhạc",
          "Cộng đồng",
          "Category 8",
          "Category 9",
        ].map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(item)}
            className={`px-4 py-2 rounded-md leading-none text-[12px] whitespace-nowrap ${
              item === active
                ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                : "bg-[#f2f2f2] dark:bg-[#2c2f32] text-[#111111] dark:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div> */}

      <div className="flex flex-col sm:flex-row gap-[16px] mt-[20px] pb-[50px]">
        <div className="w-[55%] pr-[50px]">
          <h1 className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] uppercase mb-2">
            Dự án nổi bật
          </h1>
          {mainCampaign && (
            <FundCard
              {...mainCampaign}
              // campaignsByUser={campaignsByUser}
              handleClick={() =>
                navigate(`/campaign-details/${mainCampaign.slug}`)
              }
            />
          )}
        </div>
        <div className="w-[45%] pl-[50px]">
          <h1 className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] uppercase mb-2">
            Đề xuất cho bạn
          </h1>
          <DisplayCampaigns
            title="Tất cả dự án"
            isLoading={isLoading}
            campaigns={campaigns}
          />
        </div>
      </div>
      {/* Education */}
      <HorizontalList
        data={campaignsByEducation}
        title={"Giáo dục và học tập"}
      />
    </div>
  );
};

export default Home;
