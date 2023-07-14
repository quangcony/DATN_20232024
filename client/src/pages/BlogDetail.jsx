import React from "react";
import { useLocation } from "react-router-dom";
import Comment from "../components/Comment";

const BlogDetail = () => {
  const { state } = useLocation();

  return (
    <>
      <div className="flex flex-wrap mt-[20px] blog-page gap-10">
        <article className="w-full text-[#111111] dark:text-white leading-6 font-epilogue flex-1 text-justify">
          <h2 className="text-[28px] mb-2 leading-9">{state.title}</h2>
          <p className="text-gray-500 text-right">
            Hạn chót: {new Date(state.deadline).toLocaleDateString()}
          </p>
          <p className="font-epilogue font-semibold mb-5">
            {state.description}
          </p>
          <div dangerouslySetInnerHTML={{ __html: state.content }}></div>
        </article>

        <aside className="w-full md:w-[220px] lg:w-[280px] ">
          <header className="border-b border-black dark:border-white">
            <h2 className="font-epilogue font-semibold uppercase tracking-[1.05px] text-[#111111] dark:text-white text-[16px]">
              Dự án liên quan
            </h2>
          </header>
          <div className="flex flex-col gap-5 mt-4">
            {Array.from({ length: 2 }).map((item, i) => (
              <div
                key={i}
                className="rounded-md overflow-hidden bg-[#f2f2f2] dark:bg-[#6a6a6a]"
              >
                <img
                  src="https://vtv1.mediacdn.vn/zoom/640_400/2023/1/3/03012023-covid-1672723503382272631593-crop-1672723509078616220674.jpg"
                  alt=""
                  className="w-full h-full max-h-[140px] object-cover"
                />
                <div className="p-2 text-center">
                  <h3 className="font-epilogue font-semibold cursor-pointer text-[16px] text-[#111111] dark:text-white leading-[26px] truncate">
                    Gây quỹ hộ trợ Covid-19
                  </h3>
                  <p className="mt-[5px] font-epilogue font-normal text-[#808191] dark:text-slate-300 leading-[16px]">
                    Hạn chót: 10/7/2023
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-10 w-full md:w-[calc(100%-220px-40px)] lg:w-[calc(100%-280px-40px)]">
        <Comment />
      </div>
    </>
  );
};

export default BlogDetail;
