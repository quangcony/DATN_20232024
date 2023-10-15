import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CustomButton } from "./";
import {
  add,
  brand,
  coinbase,
  logo,
  menu,
  metamask,
  search,
  trustWallet,
  user,
  wallet,
  walletConnect,
} from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context";
import { Button, Drawer, Dropdown, Modal, Switch } from "antd";
import {
  ArrowRightOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [logged, setLogged] = useState(false);
  const {
    connect,
    connectWithCoinbase,
    connectWithTrust,
    connectWithWalletConnect,
    address,
    getBalance,
  } = useStateContext();
  const [query, setQuery] = useState("");
  const [secretAddress, setSecretAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState();
  const [dark, setDark] = useState(
    localStorage.darkMode === "true" ||
      (!("darkMode" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const onToggleDarkMode = (checked) => {
    localStorage.removeItem("darkMode");
    if (checked) {
      setDark(true);
      localStorage.setItem("darkMode", true);
    } else {
      setDark(false);
      localStorage.setItem("darkMode", false);
    }
  };

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

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
      navigate(`/results?keyword=${query}`);
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

  useEffect(() => {
    const isLogged = localStorage.getItem("profile");
    if (isLogged) {
      setLogged(true);
    } else {
      setLogged(false);
    }
  }, [localStorage.getItem("profile")]);

  useEffect(() => {
    if (logged) {
      setProfile(JSON.parse(localStorage.getItem("profile")));
    }
  }, [logged]);

  return (
    <div className="flex justify-between items-center gap-2 sm:gap-4">
      <Link to="/">
        <div className="w-[72px] lg:w-full flex sm:justify-center items-center">
          <div
            className={`w-[24px] h-[24px] sm:w-[36px] sm:h-[36px] rounded-[4px] bg-[#40af65] flex justify-center items-center md:mr-2`}
          >
            <img src={brand} alt="fund_logo" className="w-1/2 h-1/2" />
          </div>
          {/* <div className="hidden lg:hidden">
            <h2 className="font-epilogue font-bold text-[#009432] uppercase text-[14px] sm:text-[16px] tracking-[1.2px] ">
              vietnamese
            </h2>
            <p className="font-epilogue font-medium text-[10px] sm:text-[12px] text-[#808191]">
              Together we can change the world
            </p>
          </div> */}
        </div>
      </Link>

      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[40px] md:h-[44px] bg-transparent border border-[#a1a1a1c9] dark:border-[#333333] rounded-[100px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Tìm kiếm tên, mô tả của dự án"
          className="flex w-full font-epilogue font-normal text-[12px] md:text-[14px] placeholder:text-[#4b5264] text-[#111111] dark:text-white bg-transparent outline-none"
        />

        <div
          onClick={goToSearch}
          className={`w-[72px] h-full rounded-[20px] bg-[#009432] flex justify-center items-center ${
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

      <div className="sm:flex hidden flex-row gap-4">
        <div className="flex gap-4 items-center">
          {!address && (
            <CustomButton
              btnType="button"
              title={"Kết nối ví"}
              styles={
                "text-[#111111] bg-[#e3e3e3] dark:bg-[#57606f] dark:text-white"
              }
              // icon={address ? add : ""}
              handleClick={() => {
                setIsModalOpen(true);
                // if (address) navigate("/create-campaign");
                // else {
                //   setIsModalOpen(true);
                // }
              }}
            />
          )}

          {!logged && (
            <Link
              to={"/login"}
              className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white transition-all hover:underline"
            >
              Log in
            </Link>
          )}
        </div>
        <div className="h-[50px] flex flex-col justify-center">
          {logged && profile && (
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <Link
                        to={`/profile/${profile.slug}`}
                        className="flex items-center gap-2"
                      >
                        <UserOutlined />
                        Xem hồ sơ
                      </Link>
                    ),
                    key: "profile",
                  },
                  {
                    label: (
                      <a className="flex items-center gap-2">
                        <LogoutOutlined />
                        Đăng xuất
                      </a>
                    ),
                    key: "signout",
                  },
                ],

                onClick: ({ key }) =>
                  key === "signout" &&
                  (localStorage.removeItem("profile"), setLogged(false)),
              }}
              arrow
            >
              {/* <Link to="/profile"> */}
              <div className="cursor-pointer">
                <p className="text-[#111111] dark:text-white underline uppercase text-[14px] tracking-[2px] flex items-center">
                  <span className="w-[6px] h-[6px] bg-[#009432] rounded-full inline-block mr-1"></span>
                  Hi, {profile.orgName}
                </p>
              </div>

              {/* <div className="ml-2 w-[40px] h-[40px] rounded-full overflow-hidden bg-[#f2f2f2] dark:bg-[#2c2f32] flex justify-center items-center cursor-pointer">
                <img
                  src={profile.image}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div> */}
              {/* </Link> */}
            </Dropdown>
          )}
          <p className="text-gray-500 text-sm">{secretAddress}</p>
        </div>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center ">
        {/* <div className="w-[40px] h-[40px] rounded-[4px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
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
          onClick={() => setToggleDrawer(true)}
        />
        {/* Drawer nav on mobile */}
        <div>
          <Drawer
            placement="right"
            onClose={() => setToggleDrawer(false)}
            open={toggleDrawer}
            className="nav-drawer"
          >
            <ul className="mb-4">
              {navlinks.map((link) => (
                <li
                  key={link.name}
                  className={`flex p-4 hover:bg-slate-300 ${
                    isActive === link.link && "bg-[#3a3a43]"
                  }`}
                  onClick={() => {
                    setIsActive(link.link);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }}
                >
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${
                      isActive === link.link
                        ? "grayscale-0"
                        : "grayscale-[80%] dark:grayscale"
                    }`}
                  />
                  <p
                    className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                      isActive === link.link
                        ? "text-[#009432]"
                        : "text-[#111111] dark:text-white"
                    }`}
                  >
                    {link.title}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex mx-4">
              <CustomButton
                btnType="button"
                title={"Kết nối ví"}
                styles={
                  "text-[#111111] bg-[#e3e3e3] dark:bg-[#57606f] dark:text-white"
                }
                // icon={address ? add : wallet}
                handleClick={() => {
                  // if (address) navigate("/create-campaign");
                  // else connect();
                  setIsModalOpen(true);
                }}
              />
            </div>

            {/* <div className="w-[48px] h-[48px] rounded-[4px] bg-white dark:bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img
                src={dark ? sun : moon}
                alt="switch mode"
                className="w-1/2 h-1/2"
                onClick={onToggleDarkMode}
              /> */}

            {/* </div> */}
            <div className="inline-flex mt-4 mx-4 gap-2">
              <h2 className="text-[#111111] font-semibold ] dark:text-white">
                Giao diện tối:{" "}
              </h2>
              <Switch defaultChecked={dark} onChange={onToggleDarkMode} />
            </div>
          </Drawer>
        </div>
        {/* Drawer nav on mobile */}
      </div>

      {/* Wallet connect Modal */}
      <Modal
        className="modal-show"
        centered
        width={460}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <div key="back" className="flex justify-center">
            <CustomButton
              btnType="button"
              title="Tiếp tục mà không đăng nhập"
              styles="bg-transparent text-[#009432] text-[16px]"
              handleClick={() => setIsModalOpen(false)}
            />
          </div>,
        ]}
        maskClosable={false}
      >
        <h2 className="font-semibold text-[22px] mb-5 font-epilogue">
          Chọn ví của bạn
        </h2>
        <div>
          <div className="w-full relative h-[50px]">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full h-full rounded-md bg-[#e3e3e3] dark:bg-[#232326] text-[#111111] dark:text-white text-[16px] pl-4 outline-none"
            />
            <button
              type="button"
              className="absolute top-[13px] right-2 w-[24px] h-[24px] bg-transparent flex items-center"
            >
              <ArrowRightOutlined style={{ fontSize: 16 }} />
            </button>
          </div>
          <div className="text-center text-[16px] text-gray-500 uppercase py-3">
            or
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="relative w-full h-[50px] bg-[#e3e3e3] dark:bg-[#232326] rounded-md flex items-center gap-4 font-medium text-[18px]"
              onClick={async () => {
                await connect();
                setIsModalOpen(false);
              }}
            >
              <img src={metamask} className="w-[46px] h-[46px] pl-4" alt="" />
              MetaMask
              <div className="absolute top-0 right-4 text-[12px] opacity-60 font-semibold uppercase flex items-center h-full">
                Phổ biến
              </div>
            </button>
            <button
              type="button"
              className="w-full h-[50px] bg-[#e3e3e3] dark:bg-[#232326] rounded-md flex items-center gap-4 font-medium text-[18px]"
              onClick={async () => {
                await connectWithCoinbase();
                setIsModalOpen(false);
              }}
            >
              <img src={coinbase} className="w-[46px] h-[46px] pl-4" alt="" />
              Coinbase
            </button>
            <button
              type="button"
              className="w-full h-[50px] bg-[#e3e3e3] dark:bg-[#232326] rounded-md flex items-center gap-4 font-medium text-[18px]"
              onClick={async () => {
                await connectWithTrust();
                setIsModalOpen(false);
              }}
            >
              <img
                src={trustWallet}
                className="w-[46px] h-[46px] pl-4"
                alt=""
              />
              Trust
            </button>
            <button
              type="button"
              className="w-full h-[50px] bg-[#e3e3e3] dark:bg-[#232326] rounded-md flex items-center gap-4 font-medium text-[18px]"
              onClick={async () => {
                await connectWithWalletConnect();
                setIsModalOpen(false);
              }}
            >
              <img
                src={walletConnect}
                className="w-[46px] h-[46px] pl-4"
                alt=""
              />
              WalletConnect
            </button>
          </div>
        </div>
      </Modal>
      {/* END wallet connect modal */}
    </div>
  );
};

export default Navbar;
