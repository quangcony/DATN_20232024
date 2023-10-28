import React, { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { useStateContext } from "../context";
import { Link, useParams } from "react-router-dom";
import { loader } from "../assets";
import { Helmet } from "react-helmet";
import { CardSkeleton } from "../components";

const BlogDetail = () => {
  const { slug } = useParams();

  const { contract, getCampaign, getRelatedCampaings } = useStateContext();
  const [data, setData] = useState();
  const [similarData, setSimilarData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Get campaign by slug
  useEffect(() => {
    const fetchCampaign = async () => {
      if (slug && contract) {
        setIsLoading(true);
        try {
          const data = await getCampaign(slug);
          setData(data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.log(error);
        }
      }
    };
    fetchCampaign();
  }, [slug, contract]);

  useEffect(() => {
    const fetchSimilarCampaigns = async () => {
      if (data) {
        setSimilarLoading(true);
        try {
          const similar = await getRelatedCampaings(data._id);
          setSimilarData(similar);
          setSimilarLoading(false);
        } catch (error) {
          console.log("get related campaigns error::", error);
          setSimilarLoading(false);
        }
      }
    };
    fetchSimilarCampaigns();
  }, [data, contract]);

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
      {data && !isLoading && (
        <>
          <Helmet>
            <title>{data.title}</title>
          </Helmet>
          <div className="flex flex-wrap mt-[20px] blog-page gap-10">
            <article className="w-full text-[#111111] dark:text-white font-epilogue flex-1 text-justify pr-14">
              <h2 className="text-[28px] mb-2 leading-9">{data.title}</h2>
              <p className="text-gray-500 text-right">
                Hạn chót: {new Date(data.deadline).toLocaleDateString()}
              </p>
              <div className="mb-5">
                <h2 className="text-[#111111] dark:text-white text-[22px] font-bold mb-2 tracking-[1.1px]">
                  Tóm tắt
                </h2>
                <p className="font-epilogue font-semibold">
                  {data.description}
                </p>
              </div>
              <div>
                <h2 className="text-[#111111] dark:text-white text-[22px] font-bold mb-2 tracking-[1.1px]">
                  Câu chuyện
                </h2>
                <div
                  className="post-detail"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                ></div>
              </div>
            </article>

            <aside className="w-full md:w-[220px] lg:w-[280px] ">
              <header className="border-b border-black dark:border-white">
                <h2 className="font-epilogue font-semibold uppercase tracking-[1.05px] text-[#111111] dark:text-white text-[16px]">
                  Dự án liên quan
                </h2>
              </header>
              <div className="flex flex-col gap-5 mt-4">
                {similarLoading &&
                  Array.from({ length: 3 }).map((s, i) => (
                    <div key={i} className="mb-3">
                      <CardSkeleton vertical={true} />
                    </div>
                  ))}
                {!similarLoading &&
                  similarData.map((item, i) => (
                    <Link
                      to={`/campaign-details/${item.slug}`}
                      key={i}
                      className="rounded-md overflow-hidden bg-[#f2f2f2] dark:bg-[#6a6a6a]"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full max-h-[140px] object-cover"
                      />
                      <div className="py-2 px-3 text-center">
                        <h3 className="font-epilogue font-semibold cursor-pointer text-[16px] text-[#111111] dark:text-white leading-[26px] truncate">
                          {item.title}
                        </h3>
                        <p className="mt-[5px] font-epilogue font-normal text-[#808191] dark:text-slate-300 leading-[12px]">
                          Mục tiêu: {item.target} ETH
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </aside>
          </div>

          <div className="mt-10 pt-10 w-full md:w-[calc(100%-220px-40px)] lg:w-[calc(100%-280px-40px)]">
            <Comment campaignId={data._id} />
          </div>
        </>
      )}
    </>
  );
};

export default BlogDetail;
