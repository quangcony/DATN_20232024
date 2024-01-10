import React, { createContext, useContext, useState } from "react";
import crowdfundingApi from "../api/crowdfundingApi";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  // Call api
  const getStatisticData = async () => {
    const data = await crowdfundingApi.getStatisticData();

    return data;
  };

  const getAllUser = async () => {
    const data = await crowdfundingApi.getAllUser();

    return data;
  };

  const getAllCampaign = async () => {
    const data = await crowdfundingApi.getAllCampaign();

    const newData = data.map((d) => ({
      ...d,
      genres: d.genres?.join(' ')
    }))

    return newData;
  };

  const getCampaignsByQuery = async (query) => {
    const data = await crowdfundingApi.getCampaignsByQuery(query);

    return data;
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        getStatisticData,
        getAllUser,
        getAllCampaign,
        getCampaignsByQuery
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
