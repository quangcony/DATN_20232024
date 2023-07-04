import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, imgUrl, isActive, disabled, handleClick, link }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === link && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== link && "grayscale"}`}
      />
    )}
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("/");
  const location = useLocation();

  useEffect(() => {
    if (location) {
      setIsActive(location.pathname);
    }
  }, [location]);

  return (
    <div className="flex justify-between items-center flex-col sticky top-[52px] h-[90vh]">
      {/* <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link> */}

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] px-3 py-4 mt-12">
        <div>
          {navlinks.map((link) => (
            <div
              key={link.name}
              onClick={() => {
                // setIsActive(location.pathname);
                navigate(link.link);
              }}
              className="flex items-center justify-between cursor-pointer"
            >
              <Icon
                {...link}
                isActive={isActive}
                // handleClick={() => {
                //   if (!link.disabled) {
                //     setIsActive(link.name);
                //     navigate(link.link);
                //   }
                // }}
              />
              <span
                className={`ml-2 flex-1 text-left text-[14px] font-epilogue font-medium hidden lg:block ${
                  link.link === isActive ? "text-[#EA2027]" : "text-white"
                }`}
              >
                {link.title}
              </span>
            </div>
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  );
};

export default Sidebar;
