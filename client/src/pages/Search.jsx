import React, { useState, useEffect } from "react";

import { CampaignList } from "../components";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { removeAccents } from "../common";
import { useStateContext } from "../context";
import { notFound } from "../assets";
import CardSkeleton from "../components/CardSkeleton";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState();
  const { getCampaignsBySearch } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (searchParams.get("keyword")) {
      setKeyword(searchParams.get("keyword"));
    }
  }, [searchParams.get("keyword")]);

  useEffect(() => {
    const fetchCampaigns = async (query) => {
      setIsLoading(true);
      try {
        const campaings = await getCampaignsBySearch(query);
        setData(campaings);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    if (keyword) {
      console.log("keyword::", keyword);
      console.log("removeAccents(keyword)", removeAccents(keyword));

      fetchCampaigns(removeAccents(keyword));
    }
  }, [keyword]);

  return (
    keyword && (
      <>
        <Helmet>
          <title>Tìm kiếm cho từ khóa "{keyword}"</title>
        </Helmet>

        {isLoading &&
          Array.from({ length: 3 }).map((s, i) => (
            <div key={i} className="mb-3">
              <CardSkeleton w={376} h={187} />
            </div>
          ))}

        {!isLoading && data.length === 0 && (
          <div className="flex flex-col justify-center items-center p-20">
            <img src={notFound} width={90} alt="" />
            <h3 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white mt-2 max-w-sm text-center leading-6">
              Xin lỗi! Chúng tôi không thể tìm thấy kết quả cho từ khóa{" "}
              <strong className="text-[#009432]">{keyword}</strong>
              ...Thử tìm từ khóa khác.
            </h3>
          </div>
        )}

        {!isLoading && data.length > 0 && (
          <>
            <h1 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white text-left mb-4">
              Tìm thấy {data.length} kết quả cho
              <strong className="text-[#009432] ml-2 ">{keyword}</strong>
            </h1>
            <CampaignList campaings={data} />
          </>
        )}
      </>
    )
  );
};

export default SearchPage;
