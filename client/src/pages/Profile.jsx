import React, { useState, useEffect } from "react";

import { useStateContext } from "../context";
import { useNavigate } from "react-router";
// import MutationUpdateCampaign from "../components/MutationUpdateCampaign";
import { CampaignGrid, CustomButton } from "../components";
// import { useParams } from "react-router-dom";
import { CheckCircleFilled, CheckCircleTwoTone } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import { Dropdown, Select, Space } from "antd";

const Profile = () => {
  const navigate = useNavigate();
  // const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { getCampaignsByUser } = useStateContext();
  // const [isEdit, setIsEdit] = useState();

  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();
  const [status, setStatus] = useState("all");

  //define for update campaign
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [campaign, setCampaign] = useState();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (profile) {
        setIsLoading(true);
        try {
          const campaigns = await getCampaignsByUser(profile.slug);
          setData(campaigns);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.log("get all campaign error");
        }
      }
    };
    fetchCampaigns();
  }, [profile]);

  useEffect(() => {
    if (logged) {
      const user = JSON.parse(localStorage.getItem("profile"));
      setProfile(user);
    }
  }, [logged]);

  const onCreateCampaign = () => {
    navigate('/create-campaign')
  }

  useEffect(() => {
    if(data?.length > 0) {
      try {
        if(status === 'all') {
          setFilteredData(data)
        }else {
          const filter = data.filter(item => item.status === status)
          setFilteredData(filter)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [status, data])
  

  const handleStatusChange = (value) => {
    setStatus(value)
  };

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
       <Helmet>
        <title>{profile.orgName}</title>
      </Helmet>
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
      
      <div className="flex flex-row justify-between items-center">

      <h2 className="flex-1 font-semibold text-[18px] text-[#111111] dark:text-white mb-4">
        Dự án &nbsp;&#40;{filteredData.length}&#41;
      </h2>
     <Space>

    <Select
      defaultValue="all"
      style={{
        width: 150,
      }}
      onChange={handleStatusChange}
      options={[
        {
          value: 'all',
          label: 'Tất cả',
        },
        {
          value: 'active',
          label: 'Đang mở',
        },
        {
          value: 'pending',
          label: 'Đợi xác nhận',
        },
       
      ]}
    />
      <CustomButton handleClick={onCreateCampaign} title="Tạo dự án" styles={"bg-blue-500 text-white"}/>
     </Space>
      </div>
      <CampaignGrid data={filteredData} isLoading={isLoading} />
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
