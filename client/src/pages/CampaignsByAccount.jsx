import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useParams } from "react-router-dom";
import { DisplayCampaigns } from "../components";

const CampaignsByAccount = () => {
  const { account } = useParams();
  const { getCampaigns } = useStateContext();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (account) {
        setIsLoading(true);
        try {
          const data = await getCampaigns();
          if (data) {
            const campaigns = data.filter(
              (campaign) => campaign.owner === account
            );
            setData(campaigns);
          }
          setIsLoading(false);
        } catch (error) {
          console.log("get all campaign error");
          setIsLoading(false);
        }
      }
    };
    fetchCampaigns();
  }, [account]);

  return (
    <DisplayCampaigns
      title="Tất cả chiến dịch"
      campaigns={data}
      isLoading={isLoading}
    />
  );
};

export default CampaignsByAccount;
