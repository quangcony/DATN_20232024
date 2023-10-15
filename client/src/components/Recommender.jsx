import React, { useEffect, useState } from "react";
import DisplayCampaigns from "./DisplayCampaigns";
import { useStateContext } from "../context";

const Recommender = () => {
  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();
  const { getRecommendData } = useStateContext();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (logged) {
      const profile = JSON.parse(localStorage.getItem("profile"));
      setProfile(profile);
    }
  }, [logged]);

  useEffect(() => {
    const fetchRecommendData = async () => {
      if (profile) {
        setLoading(true);
        try {
          const res = await getRecommendData(profile._id);
          setData(res);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    };
    fetchRecommendData();
  }, [profile]);

  return (
    <>
      <h1 className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] uppercase mb-2">
        Đề xuất cho bạn
      </h1>
      <DisplayCampaigns
        title="Tất cả dự án"
        isLoading={isLoading}
        campaigns={data}
      />
    </>
  );
};

export default Recommender;
