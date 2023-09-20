import React, { useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DefaultLayout = ({ children }) => {
  const headerRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;

      if (scrollTop > 30) {
        headerRef.current.style.zIndex = 999;
      } else {
        headerRef.current.style.zIndex = 10;
      }
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <div className="relative">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full px-4 py-3 bg-white dark:bg-[#13131a] z-10"
      >
        <Navbar />
      </header>

      <div className="p-4 bg-white dark:bg-[#13131a] min-h-screen flex">
        <div className="sm:block hidden w-0 sm:w-[70px] lg:w-[200px] relative">
          <Sidebar />
        </div>
        <div className="flex-1 w-full overflow-y-auto sm:w-[calc(100%-114px)] md:w-[calc(100%-240px)] mx-auto sm:pr-5 py-5 sm:pl-10 pt-[72px] relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
