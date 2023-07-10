import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Sidebar, Navbar } from "./components";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import SearchPage from "./pages/Search";
import Payment from "./pages/Payment";
import CampaignsByAccount from "./pages/CampaignsByAccount";
import Logout from "./pages/Logout";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const appRef = useRef();

  return (
    <div className="relative" ref={appRef}>
      <div className="fixed top-0 left-0 w-full p-4 bg-white dark:bg-[#13131a] z-10">
        <Navbar />
      </div>
      <div className="p-4 bg-white dark:bg-[#13131a] min-h-screen mt-[52px] flex">
        <div className="sm:block hidden w-0 sm:w-[70px] lg:w-[200px] mr-10 relative">
          <Sidebar appRef={appRef} />
        </div>

        <div className="flex-1 w-full overflow-y-auto sm:w-[calc(100%-114px)] md:w-[calc(100%-240px)] max-w-[1280px] mx-auto sm:pr-5 py-5 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/results" element={<SearchPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route
              path="/campaigns/:account"
              element={<CampaignsByAccount />}
            />
            <Route path="*" exact={true} element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
