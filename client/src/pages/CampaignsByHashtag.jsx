import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../context";
import { CampaignGrid } from "../components";

const CampaignsByHashtag = () => {
  const { hashtag } = useParams();
  const { getCampaignsByTag } = useStateContext();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (hashtag) {
        setIsLoading(true);
        try {
          const campaigns = await getCampaignsByTag(hashtag);
          setData(campaigns);
          setIsLoading(false);
        } catch (error) {
          console.log("get campaigns error::", error);
          setIsLoading(false);
        }
      }
    };
    fetchCampaigns();
  }, [hashtag]);

  return (
    <>
      <div className="mb-4">
        <h2 className="font-semibold text-[18px] text-[#111111] dark:text-white mb-1">
          &#35;{hashtag}
        </h2>
        <h3 className="font-semibold text-[16px] text-slate-500">
          {data.length} dự án
        </h3>
      </div>
      <CampaignGrid data={data} isLoading={isLoading} />
    </>
  );
};

export default CampaignsByHashtag;
