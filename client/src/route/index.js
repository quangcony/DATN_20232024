import HeaderLayout from "../components/HeaderLayout";
import { CampaignDetails, CreateCampaign, Home, Profile } from "../pages";
import BlogDetail from "../pages/BlogDetail";
import CampaignsByAccount from "../pages/CampaignsByAccount";
import CampaignsByHashtag from "../pages/CampaignsByHashtag";
import Logout from "../pages/Logout";
import NotFound from "../pages/NotFound";
import Payment from "../pages/Payment";
import SearchPage from "../pages/Search";
import LoginPage from "../pages/auth";

export const routes = [
  { path: "/", component: Home, layout: HeaderLayout },
  { path: "/profile/:id", component: Profile, layout: HeaderLayout },
  { path: "/login", component: LoginPage, layout: HeaderLayout },
  { path: "/create-campaign", component: CreateCampaign, layout: HeaderLayout },
  {
    path: "/campaign-details/:slug",
    component: CampaignDetails,
    layout: HeaderLayout,
  },

  { path: "/payment", component: Payment },
  { path: "/results", component: SearchPage },
  { path: "/logout", component: Logout },
  { path: "/blog/:slug", component: BlogDetail, layout: HeaderLayout },
  {
    path: "/campaigns/user/:slug",
    component: CampaignsByAccount,
  },
  {
    path: "/hashtag/:hashtag",
    component: CampaignsByHashtag,
  },
  { path: "*", component: NotFound, layout: HeaderLayout },
];
