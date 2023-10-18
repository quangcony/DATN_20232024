import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { useParams } from "react-router-dom";
import { CampaignGrid } from "../components";

const CampaignsByAccount = () => {
  const { slug } = useParams();
  const { getCampaignsByUser } = useStateContext();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (slug) {
        setIsLoading(true);
        try {
          const campaigns = await getCampaignsByUser(slug);
          setData(campaigns);
          setIsLoading(false);
        } catch (error) {
          console.log("get all campaign error");
          setIsLoading(false);
        }
      }
    };
    fetchCampaigns();
  }, [slug]);

  return (
    <>
      <h2 className="font-semibold text-[18px] text-[#111111] dark:text-white mb-4">
        Dự án bởi&nbsp;
        <span className="text-[#009432]">{slug}</span>
        &nbsp;&#40;{data.length}&#41;
      </h2>
      <CampaignGrid data={data} isLoading={isLoading} />
    </>
  );
};

export default CampaignsByAccount;
