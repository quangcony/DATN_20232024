import React from "react";
import { useStateContext } from "../context";

const Logout = () => {
  const { disconnect } = useStateContext();
  return (
    <div className="flex flex-col justify-center items-center p-20 gap-2">
      <h3 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white mt-2 max-w-sm text-center leading-6">
        Bỏ kết nối đến ví?
      </h3>
      <button
        type="button"
        onClick={disconnect}
        className="text-[#111111] dark:text-white text-[16px] border border-black dark:border-white px-8 py-3 rounded-lg leading-none"
      >
        Đồng ý
      </button>
    </div>
  );
};

export default Logout;
