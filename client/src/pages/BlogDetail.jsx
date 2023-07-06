import React from "react";
import { useLocation } from "react-router-dom";

const BlogDetail = () => {
  const { state } = useLocation();

  return (
    <div className="flex flex-wrap mt-[20px] blog-page">
      <div className="w-full text-[#111111] dark:text-white leading-6 font-epilogue flex-1 text-justify">
        <h2 className="text-[28px] mb-2 leading-9">{state.title}</h2>
        <p className="text-gray-500 text-right">
          Hạn chót: {new Date(state.deadline).toLocaleDateString()}
        </p>
        <p className="font-epilogue font-semibold mb-5">{state.description}</p>
        <div dangerouslySetInnerHTML={{ __html: state.content }}></div>
      </div>
      <div className="w-full md:w-[350px]"></div>
    </div>
  );
};

export default BlogDetail;
