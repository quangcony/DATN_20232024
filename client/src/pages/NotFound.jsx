import { Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title={
        <h2 className="text-[#111111] dark:text-white text-[20px]">404</h2>
      }
      subTitle={
        <h2 className="text-slate-500 text-[16px]">
          Xin lỗi, trang bạn ghé thăm không tồn tại.
        </h2>
      }
      extra={
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-[#111111] dark:text-white text-[16px] border border-black dark:border-white px-8 py-3 rounded-lg leading-none"
        >
          Về trang chủ
        </button>
      }
    />
  );
};

export default NotFound;
