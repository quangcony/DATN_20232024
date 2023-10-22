import React, { useState, useEffect } from "react";

import { useStateContext } from "../context";
import { useNavigate } from "react-router";
import MutationUpdateCampaign from "../components/MutationUpdateCampaign";
import { CampaignGrid } from "../components";
import { useParams } from "react-router-dom";
import { CheckCircleFilled, CheckCircleTwoTone } from "@ant-design/icons";

const Profile = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const { getCampaignsByUser } = useStateContext();
  // const [isEdit, setIsEdit] = useState();

  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();

  //define for update campaign
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [campaign, setCampaign] = useState();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (slug) {
        setIsLoading(true);
        try {
          const campaigns = await getCampaignsByUser(slug);
          console.log("campaigns::", campaigns);
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

  useEffect(() => {
    if (logged) {
      const user = JSON.parse(localStorage.getItem("profile"));
      setProfile(user);
    }
  }, [logged]);

  // const handleUpdateCampaign = (data) => {
  //   if (data) {
  //     setCampaign(data);
  //     setIsModalOpen(true);
  //   }
  // };

  // useEffect(() => {
  //   if (address) {
  //     setIsEdit(true);
  //   }
  // }, [address]);

  if (!profile) {
    return (
      <h2 className="font-epilogue font-semibold text-[20px] capitalize text-[#111111] dark:text-white mt-3">
        Bạn chưa đăng nhập!
      </h2>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center my-14">
        <div className="w-32 h-32 overflow-hidden rounded-full bg-slate-500 flex items-center justify-center mb-2">
          <img
            src={profile.image}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* <img src={coin} alt="" width={32} /> */}
          <h4 className="font-epilogue font-semibold text-[18px] text-[#111111] dark:text-white mt-2">
            {profile.orgName}
            <span className="inline-block ml-2 -translate-y-1">
              {profile.verified && (
                <CheckCircleFilled style={{ fontSize: 16, color: "gray" }} />
              )}
            </span>
          </h4>
        </div>
        <p className="font-epilogue font-semibold text-center text-[14px] text-gray-600 my-2">
          {profile.about}
        </p>
      </div>

      <h2 className="font-semibold text-[18px] text-[#111111] dark:text-white mb-4">
        Tất cả dự án &nbsp;&#40;{data.length}&#41;
      </h2>
      <CampaignGrid data={data} isLoading={isLoading} />
      {/* <CampaignGrid
        title="Dự án"
        user={profile}
        isEdit={isEdit}
        // onEdit={handleUpdateCampaign}
      /> */}

      {/* <MutationUpdateCampaign
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={campaign}
      /> */}
    </>
  );
};

export default Profile;
