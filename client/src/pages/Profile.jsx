import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { useNavigate } from "react-router";
import MutationUpdateCampaign from "../components/MutationUpdateCampaign";
import CampaignGrid from "../components/CampaignGrid";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, getCampaigns } = useStateContext();
  const [isEdit, setIsEdit] = useState();

  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();

  //define for update campaign
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaign, setCampaign] = useState();

  useEffect(() => {
    if (logged) {
      const user = JSON.parse(localStorage.getItem("profile"));
      setProfile(user);
    }
  }, [logged]);

  const handleUpdateCampaign = (data) => {
    if (data) {
      setCampaign(data);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (address) {
      setIsEdit(true);
    }
  }, [address]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const data = await getCampaigns();
        setCampaigns(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

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
          </h4>
        </div>
        {/* <h4 className="font-epilogue font-semibold text-[14px] text-gray-600 my-2 break-all">
          {address}
        </h4> */}
      </div>
      {/* my campaign list */}
      <CampaignGrid
        title="Dự án"
        user={profile}
        isEdit={isEdit}
        // onEdit={handleUpdateCampaign}
      />

      <MutationUpdateCampaign
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={campaign}
      />
    </>
  );
};

export default Profile;
