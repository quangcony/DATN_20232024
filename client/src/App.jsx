import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./route";
import DefaultLayout from "./components/DefaultLayout";
const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="/campaign-details/:slug" element={<CampaignDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/results" element={<SearchPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/campaigns/:account" element={<CampaignsByAccount />} />
        <Route path="*" exact={true} element={<NotFound />} /> */}

      {routes.map((route, i) => {
        let Layout = DefaultLayout;

        if (route.layout) {
          Layout = route.layout;
        } else if (route.layout === null) {
          Layout = Fragment;
        }
        const Page = route.component;
        return (
          <Route
            key={i}
            path={route.path}
            exact={true}
            element={
              <Layout>
                <Page />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  );
};

export default App;
