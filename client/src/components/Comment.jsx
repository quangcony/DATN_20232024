import React from "react";
import { truncateMiddleText } from "../common";
import { user } from "../assets";
import { LikeOutlined, HeartOutlined } from "@ant-design/icons";

const Comment = () => {
  return (
    <div>
      <h2 className="font-epilogue font-semibold text-[20px] capitalize text-[#111111] dark:text-white mb-4">
        Bạn suy nghĩ gì về dự án này?
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Gửi cảm nghĩ...");
        }}
        method="post"
        className="flex gap-4"
      >
        <input
          spellCheck={false}
          type="text"
          name="comment"
          className="font-epilogue border border-[#6e6e6e] bg-transparent text-[#111111] dark:text-white rounded-md px-2 py-4 pl-4 w-full flex-1 outline-none"
        />
        <button
          type="submit"
          className="border border-[#6e6e6e] rounded-md bg-slate-500 text-white px-6 py-4"
        >
          Gửi cảm nghĩ
        </button>
      </form>

      <h2 className="ml-6 mt-8 font-epilogue font-semibold text-[16px] capitalize text-[#111111] dark:text-white ">
        Mọi người nghĩ (5)
      </h2>
      {/* comment list*/}
      <ul className="list-none ml-6">
        {Array.from({ length: 5 }).map((comment, i) => (
          <li key={i} className="">
            <div className="mt-[20px] flex flex-row items-start gap-[14px]">
              <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] cursor-pointer">
                <img
                  src={user}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="inline-flex">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white break-all">
                    @
                    {truncateMiddleText(
                      "0xa73B10dC969a376cF1F140e4E2C2ccea1b6d86eE"
                    )}
                  </h4>
                  {/* <img src={verify} width={24} alt="" /> */}
                  <h4 className="font-epilogue text-[12px] text-gray-400 break-all">
                    &nbsp;(5 giờ trước)
                  </h4>
                </div>
                <p className="mt-[4px] font-epilogue font-normal text-[14px] text-[#111111] dark:text-white">
                  Giọng anh truyền cảm, ấm áp quá! Nghe mà cảm nhận được nỗi đau
                  của nhân vật luôn. Cảm ơn anh và đội ngũ Ekip cho ra một MV
                  hay. Chúc anh và mọi người ngày càng phát triển.
                </p>

                <div className="inline-flex gap-4">
                  <button
                    type="button"
                    className="text-[#111111] dark:text-white flex gap-1 items-center leading-none"
                  >
                    <span className="-mt-1">
                      <LikeOutlined />
                    </span>
                    5
                  </button>

                  <button
                    type="button"
                    className="text-[#111111] dark:text-white flex gap-1 items-center leading-none"
                  >
                    <span className="-mt-1">
                      <HeartOutlined />
                    </span>
                    3
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comment;
