import React, { useState, useEffect } from "react";

import { CampaignList } from "../components";
import { useStateContext } from "../context";
import { useSearchParams } from "react-router-dom";
import { removeAccents } from "../common";
import { notFound } from "../assets";

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const { getCampaignsBySearch } = useStateContext();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState();

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
      fetchCampaigns(removeAccents(keyword));
    }
  }, [keyword]);

  // useEffect(() => {
  //   const fetchCampaigns = async () => {
  //     setIsLoading(true);
  //     try {
  //       const data = await getCampaignsBySearch();
  //       if (data) {
  //         setCampaigns(data);
  //         setIsLoading(false);
  //       }
  //     } catch (error) {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchCampaigns();
  // }, [address, contract]);

  // useEffect(() => {
  //   if (searchParams && campaigns?.length > 0) {
  //     const query = searchParams.get("search_query");

  //     if (query) {
  //       const data = campaigns.filter(
  //         (item) =>
  //           removeAccents(item.title)
  //             .toLowerCase()
  //             .includes(removeAccents(query).toLowerCase()) ||
  //           removeAccents(item.description)
  //             .toLowerCase()
  //             .includes(removeAccents(query).toLowerCase())
  //       );

  //       setFilteredCampaignsBySearch(data);
  //     }
  //   }
  // }, [searchParams, campaigns]);

  return (
    <>
      <h1 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white text-left mb-4">
        Tìm thấy {data.length} kết quả cho
        <strong className="text-[#009432] ml-2 ">{keyword}</strong>
      </h1>
      {!isLoading && data.length > 0 ? (
        <CampaignList isLoading={isLoading} data={data} />
      ) : (
        <div className="flex flex-col justify-center items-center p-20">
          <img src={notFound} width={90} alt="" />
          <h3 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white mt-2 max-w-sm text-center leading-6">
            Xin lỗi! Chúng tôi không thể tìm thấy kết quả cho từ khóa{" "}
            <strong className="text-[#009432]">{keyword}</strong>
            ...Thử tìm từ khóa khác.
          </h3>
        </div>
      )}
    </>
  );
};

export default SearchPage;
