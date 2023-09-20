import React from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import HorizontalItem from "./HorizontalItem";
import "swiper/css";
import "swiper/css/navigation";
import { Mousewheel, Navigation } from "swiper/modules";
import { RightOutlined } from "@ant-design/icons";

const HorizontalList = ({ data, title }) => {
  return (
    <div className="py-[50px] border-t-[1px] border-slate-500">
      <div className="relative">
        <div className="mb-2 flex gap-6 items-center group">
          <h1 className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183] uppercase ">
            {title}
          </h1>
          <Link
            to={"/"}
            className="font-epilogue text-[12px] text-[#5454ff] flex gap-2 items-center transition-all -translate-x-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 hover:underline"
          >
            Xem tất cả
            <RightOutlined />
          </Link>
        </div>
        <div className="mt-[70px]">
          <Swiper
            slidesPerView={1}
            cssMode={true}
            mousewheel={true}
            navigation={true}
            modules={[Mousewheel, Navigation]}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
            }}
            className="swiper-horizontal"
          >
            {data.map((item) => (
              <SwiperSlide>
                <HorizontalItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HorizontalList;
