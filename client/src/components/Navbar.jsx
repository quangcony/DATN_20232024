import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CustomButton } from "./";
import { add, logo, menu, search, user, wallet } from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, getBalance } = useStateContext();
  const [query, setQuery] = useState("");
  const [secretAddress, setSecretAddress] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (address) {
      const firstLettersAddress = address.substring(0, 5);
      const lastLettersAddress = address.substring(address.length - 4);

      setSecretAddress(firstLettersAddress + "..." + lastLettersAddress);
    } else {
      setSecretAddress("");
    }
  }, [address]);

  useEffect(() => {
    const getBalanceWallet = async () => {
      if (address) {
        const bal = await getBalance(address);
        const roundBal = Math.round(bal * 1000) / 1000;
        const balString = roundBal + " ETH";
        setBalance(balString);
      } else {
        setBalance("");
      }
    };
    getBalanceWallet();
  }, [address]);

  const goToSearch = useCallback(() => {
    if (query.trim().length > 2) {
      navigate(`/results?search_query=${query}`);
    } else {
      alert("Nội dung tìm kiếm phải có độ dài lớn hơn 2");
    }
  });

  useEffect(() => {
    const enterEvent = (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        if (query.trim().length > 0) {
          goToSearch(query);
        }
      }
    };
    document.addEventListener("keyup", enterEvent);
    return () => {
      document.removeEventListener("keyup", enterEvent);
    };
  }, [query]);

  return (
    <div className="flex justify-between items-center gap-6 ">
      <Link to="/">
        <div className="sm:w-[72px] lg:w-full flex sm:justify-center items-center">
          <div
            className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[10px] bg-[#f2f2f2] dark:bg-[#2c2f32] flex justify-center items-center md:mr-2`}
          >
            <img src={logo} alt="fund_logo" className="w-2/3 h-2/3" />
          </div>
          <div className="flex-1 hidden lg:block">
            <h2 className="font-epilogue font-semibold text-[#111111] dark:text-white uppercase text-[16px] tracking-[1.2px]">
              vietnamese
            </h2>
            <p className="font-epilogue font-medium text-[12px] leading-[30px] text-[#808191]">
              Together we can change the world
            </p>
          </div>
        </div>
      </Link>

      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[46px] md:h-[52px] bg-transparent border border-[#a1a1a1c9] dark:border-[#333333] rounded-[100px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Tìm kiếm tên, mô tả của dự án"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-[#111111] dark:text-white bg-transparent outline-none"
        />

        <div
          onClick={goToSearch}
          className={`w-[72px] h-full rounded-[20px] bg-[#EA2027] flex justify-center items-center ${
            query ? "cursor-pointer" : "pointer-events-none opacity-75"
          }`}
        >
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <div className="hidden lg:block">
          <CustomButton
            btnType="button"
            title={address ? "Tạo một dự án" : "Kết nối ví"}
            styles={address ? "bg-[#EA2027]" : "bg-[#e3e3e3] dark:bg-[#57606f]"}
            icon={address ? add : wallet}
            handleClick={() => {
              if (address) navigate("create-campaign");
              else connect();
            }}
          />
        </div>

        <Link to="/profile">
          <div className="flex items-center">
            <div>
              <p className="text-[#111111] dark:text-white">{balance}</p>
              <p className="text-gray-500 text-sm">{secretAddress}</p>
            </div>

            <div className="ml-2 w-[52px] h-[52px] rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img
                src={user}
                alt="user"
                className="w-[60%] h-[60%] object-contain"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center ">
        {/* <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img
            src={logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div> */}

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute w-3/5 top-[68px] right-0 bg-[#f2f2f2] dark:bg-[#1c1c24] z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "translate-x-[100vh]" : "translate-x-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name
                      ? "grayscale-0"
                      : "grayscale-[80%] dark:grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === link.name
                      ? "text-[#EA2027]"
                      : "text-[#111111] dark:text-white"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={address ? "Tạo một dự án" : "Kết nối ví"}
              styles={
                address ? "bg-[#EA2027]" : "bg-[#e3e3e3] dark:bg-[#57606f]"
              }
              icon={address ? add : wallet}
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
