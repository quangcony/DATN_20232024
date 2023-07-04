import {
  createCampaign,
  dashboard,
  globe,
  logout,
  payment,
  paymentPng,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "dashboard",
    title: "Tất cả chiến dịch",
    imgUrl: globe,
    link: "/",
  },
  {
    name: "create-campaign",
    title: "Tạo chiến dịch",
    imgUrl: createCampaign,
    link: "/create-campaign",
  },
  {
    name: "payment",
    title: "Thanh toán",
    imgUrl: paymentPng,
    link: "/payment",
    // disabled: true,
  },
  {
    name: "withdraw",
    title: "Rút tiền",
    imgUrl: withdraw,
    link: "/withdraw",
    // disabled: true,
  },
  {
    name: "profile",
    title: "Hồ sơ",
    imgUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    title: "Hủy kết nối ví",
    imgUrl: logout,
    link: "/logout",
    disabled: true,
  },
];
