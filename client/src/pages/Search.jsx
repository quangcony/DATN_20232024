import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { useSearchParams } from "react-router-dom";
import { removeAccents } from "../common";
import { notFound } from "../assets";

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaignsBySearch, setFilteredCampaignsBySearch] = useState(
    []
  );

  const { address, contract, getCampaigns } = useStateContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      if (data) {
        setCampaigns(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  useEffect(() => {
    if (searchParams && campaigns?.length > 0) {
      const query = searchParams.get("search_query");
      if (query) {
        const data = campaigns.filter(
          (item) =>
            removeAccents(item.title)
              .toLowerCase()
              .includes(removeAccents(query).toLowerCase()) ||
            removeAccents(item.description)
              .toLowerCase()
              .includes(removeAccents(query).toLowerCase())
        );

        setFilteredCampaignsBySearch(data);
      }
    }
  }, [searchParams, campaigns]);

  return (
    <>
      <h1 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white text-left mb-4">
        Tìm thấy {filteredCampaignsBySearch.length} kết quả cho
        <strong className="text-[#EA2027] ml-2 ">
          {searchParams.get("search_query")}
        </strong>
      </h1>
      {!isLoading && filteredCampaignsBySearch.length > 0 ? (
        <DisplayCampaigns
          isLoading={isLoading}
          campaigns={filteredCampaignsBySearch}
        />
      ) : (
        <div className="flex flex-col justify-center items-center p-20">
          <img src={notFound} width={90} alt="" />
          <h3 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white mt-2 max-w-sm text-center leading-6">
            Xin lỗi! Chúng tôi không thể tìm thấy kết quả cho từ khóa{" "}
            <strong className="text-[#EA2027]">
              {searchParams.get("search_query")}
            </strong>
            ...Thử tìm từ khóa khác.
          </h3>
        </div>
      )}
    </>
  );
};

export default SearchPage;
