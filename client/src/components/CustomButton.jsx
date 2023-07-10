import React from "react";

const CustomButton = ({ btnType, title, handleClick, styles, icon }) => {
  return (
    <button
      type={btnType}
      className={`flex items-center justify-center font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      <span className="mr-2">{title}</span>
      {icon && <img src={icon} width={28} alt="" />}
    </button>
  );
};

export default CustomButton;
