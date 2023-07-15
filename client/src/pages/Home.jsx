import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";
import { Helmet } from "react-helmet";
const metaTags = [
  { property: "og:url", content: "https://datn-20232024.vercel.app/" },
  { property: "og:title", content: "tiêu đề chia sẻ" },
  { property: "og:description", content: "mô tả chia sẻ" },
  {
    property: "og:image",
    content:
      "https://images.unsplash.com/photo-1688895061992-a842b5056e75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getCampaigns();
      if (data) {
        setCampaigns(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  useEffect(() => {
    metaTags.forEach((metaTag) => {
      const existingTag = document.head.querySelector(
        `meta[property="${metaTag.property}"]`
      );
      if (existingTag) {
        existingTag.setAttribute("content", metaTag.content);
      } else {
        const newTag = document.createElement("meta");
        newTag.setAttribute("property", metaTag.property);
        newTag.setAttribute("content", metaTag.content);
        document.head.appendChild(newTag);
      }
    });
  }, []);

  return (
    <div>
      {/* <Helmet>
        <title>Tiêu đề edit</title>
        <meta name="description" content={"mô tả home"} />
        <meta
          name="image"
          content={
            "https://images.unsplash.com/photo-1688895061992-a842b5056e75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          }
        />

        
      </Helmet> */}
      <DisplayCampaigns
        title="Tất cả dự án"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Home;
