import React from "react";

const CountBox = ({ title, value, size, icon }) => {
  return (
    <div className="flex flex-col items-center w-[150px]">
      <h4
        className={`font-epilogue font-bold break-words text-[${
          size ? size : "30px"
        }] text-[#111111] dark:text-white uppercase p-3 bg-[#f2f2f2]  dark:bg-[#1c1c24] rounded-t-[10px] w-full text-center`}
      >
        {value}
      </h4>
      <div className="flex gap-2 items-center justify-center font-epilogue font-normal text-[16px] text-[#111111] dark:text-[#808191] bg-[#dedede] dark:bg-[#28282e] px-3 py-2 w-full rouned-b-[10px] text-center">
        <span className="mb-[4px]">
          {icon && <img src={icon} alt="" width={24} />}
        </span>
        {title}
      </div>
    </div>
  );
};

export default CountBox;
