import React from "react";
import { Route, Routes } from "react-router-dom";

import { Sidebar, Navbar } from "./components";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import SearchPage from "./pages/Search";
import Payment from "./pages/Payment";

const App = () => {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full p-4 bg-[#13131a]">
        <Navbar />
      </div>
      <div className=" sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 mt-[52px] py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/results" element={<SearchPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
