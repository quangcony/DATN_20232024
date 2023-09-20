import React, { useEffect, useRef } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const HeaderLayout = ({ children }) => {
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

      <div className="py-4 bg-white dark:bg-[#13131a] min-h-screen">
        <div className="w-full max-w-[1280px] overflow-y-auto mx-auto px-6 py-5 mt-[72px] relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeaderLayout;
