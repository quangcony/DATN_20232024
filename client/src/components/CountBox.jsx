import React, { useEffect, useState } from "react";

const CountBox = ({ title, value, icon, timer }) => {
  const [remainingDays, setRemainingDays] = useState("");

  useEffect(() => {
    if (timer) {
      const deadline = new Date(value).getTime();

      const remainingTime = setInterval(() => {
        var now = new Date().getTime();
        var distance = deadline - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        var fHours = hours < 10 ? "0" + hours : hours;
        var fMinutes = minutes < 10 ? "0" + minutes : minutes;
        var fSeconds = seconds < 10 ? "0" + seconds : seconds;

        setRemainingDays(
          days + " Ngày " + fHours + ":" + fMinutes + ":" + fSeconds
        );

        if (distance < 0) {
          clearInterval(remainingTime);
          // setIsExpired(true);
          setRemainingDays("Hết hạn");
        }
      }, 1000);

      return () => clearInterval(remainingTime);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="h-[96px] md:h-fit flex items-center justify-center p-3 bg-[#f2f2f2] dark:bg-[#1c1c24] rounded-t-[10px] w-full">
        <h4
          className={`font-epilogue text-[26px] font-bold break-words text-[#111111] dark:text-white uppercase text-center`}
        >
          {timer ? remainingDays : value}
        </h4>
      </div>
      <div className="flex gap-2 items-center justify-center font-epilogue font-normal text-[16px] text-[#111111] dark:text-[#808191] bg-[#dedede] dark:bg-[#28282e] px-3 py-2 w-full rouned-b-[10px] text-center">
        <span className="mb-[4px]">
          {icon && <img src={icon} alt="" width={24} />}
        </span>
        {title}
      </div>
    </div>
  );
};

export default CountBox;
