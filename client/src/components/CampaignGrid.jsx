import React from "react";

import { loader } from "../assets";
import FundCardGrid from "./FundCardGrid";

const CampaignGrid = ({ data, isLoading, title, user, isEdit, onEdit }) => {
  // const navigate = useNavigate();
  // const [data, setData] = useState([]);
  // const { getCampaignsByUser } = useStateContext();
  // const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchCampaigns = async () => {
  //     if (user) {
  //       setLoading(true);
  //       try {
  //         const campaigns = await getCampaignsByUser(user._id);
  //         setData(campaigns);
  //         setLoading(false);
  //       } catch (error) {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchCampaigns();
  // }, [user]);

  // const handleNavigate = (campaign) => {
  //   navigate(`/campaign-details/${campaign.slug}`, { state: campaign });
  // };

  return (
    <>
      {isLoading && (
        <div className="flex justify-center w-full">
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-[20px] gap-[16px]">
        {!isLoading && data.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Chưa có bất kỳ dự án nào.
          </p>
        )}

        {!isLoading &&
          data.length > 0 &&
          data.map((campaign) => (
            <FundCardGrid
              // key={campaign.pId}
              {...campaign}
              // campaignsByUser={data}
              // isEdit={isEdit}
              // handleEdit={onEdit}
              // handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </>
  );
};

export default CampaignGrid;
