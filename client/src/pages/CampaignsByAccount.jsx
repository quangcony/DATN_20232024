import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useParams } from "react-router-dom";
import { DisplayCampaigns } from "../components";
import { truncateMiddleText } from "../common";

const CampaignsByAccount = () => {
  const { account } = useParams();
  const { contract, getUserCampaigns } = useStateContext();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (account) {
        setIsLoading(true);
        try {
          const campaigns = await getUserCampaigns(account);
          setData(campaigns);
          setIsLoading(false);
        } catch (error) {
          console.log("get all campaign error");
          setIsLoading(false);
        }
      }
    };
    fetchCampaigns();
  }, [account, contract]);

  return (
    <>
      <h2 className="font-semibold text-[18px] text-[#111111] dark:text-white mb-4">
        Dự án bởi&nbsp;
        <span className="text-[#009432]">{truncateMiddleText(account)}</span>
        &nbsp;&#40;{data.length}&#41;
      </h2>
      <DisplayCampaigns campaigns={data} isLoading={isLoading} />
    </>
  );
};

export default CampaignsByAccount;
