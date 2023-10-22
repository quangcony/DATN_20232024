import React, { useEffect, useState } from "react";
import { truncateMiddleText } from "../common";
import { user } from "../assets";
import {
  LikeOutlined,
  HeartOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { useStateContext } from "../context";
import moment from "moment";
import "moment/dist/locale/vi";
import { Link } from "react-router-dom";

const Comment = ({ campaignId }) => {
  const [message, setMessage] = useState("");
  const { addComment, getComments, contract } = useStateContext();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();

  //Set locale to vietnamese
  moment.locale("vi");

  useEffect(() => {
    if (logged) {
      setProfile(JSON.parse(localStorage.getItem("profile")));
    }
  }, [logged]);

  const fetchComments = async () => {
    if (campaignId || campaignId === 0) {
      setIsLoading(true);
      try {
        const data = await getComments(campaignId);
        setComments(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (contract) fetchComments();
  }, [campaignId, contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length > 2) {
      try {
        await addComment(campaignId, profile._id, message);
        setMessage("");
        fetchComments();
      } catch (error) {
        console.log("add a comment failed!");
      }
    }
  };

  return (
    <div>
      <h2 className="font-epilogue font-semibold text-[20px] text-[#111111] dark:text-white mb-4">
        Bạn suy nghĩ gì về dự án này?
      </h2>

      <form onSubmit={handleSubmit} method="post" className="flex gap-4">
        <input
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          spellCheck={false}
          type="text"
          name="comment"
          className="font-epilogue border text-[14px] border-[#6e6e6e] bg-transparent text-[#111111] dark:text-white rounded-md px-2 py-2 pl-4 w-full flex-1 outline-none"
        />

        {logged ? (
          <button
            type="submit"
            className="border border-[#6e6e6e] rounded-md bg-slate-500 text-white px-4 md:px-6 py-2 "
          >
            Bình luận
          </button>
        ) : (
          <Link
            to={"/login"}
            className="border border-[#6e6e6e] rounded-md bg-slate-500 text-white px-4 md:px-6 py-2 "
          >
            Đăng nhập
          </Link>
        )}
      </form>

      <div className="inline-flex mt-8 gap-6">
        <h2 className="text-[14px] text-[#111111] dark:text-white ">
          {comments.length} bình luận
        </h2>

        <button
          type="button"
          className="text-[#111111] dark:text-white flex gap-1 items-center leading-none text-[14px]"
        >
          <span className="-mt-1 mr-1">
            <AlignLeftOutlined style={{ fontSize: 12 }} />
          </span>
          Sắp xếp theo
        </button>
      </div>

      {/* comment list*/}
      <ul className="list-none ">
        {comments.map((comment, i) => (
          <li key={i} className="">
            <div className="mt-[20px] flex flex-row items-start gap-[14px]">
              <div className="w-[40px] h-[40px] overflow-hidden flex items-center justify-center rounded-full bg-[#f2f2f2] dark:bg-[#2c2f32] cursor-pointer">
                <img
                  src={comment.User.image}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="inline-flex">
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#111111] dark:text-white break-all">
                    @{comment.User.orgName}
                  </h4>
                  {/* <img src={verify} width={24} alt="" /> */}
                  <h4 className="font-epilogue text-[12px] text-gray-400 break-all">
                    &nbsp;(
                    {moment(comment.createdAt).fromNow()})
                  </h4>
                </div>
                <p className="mt-[4px] font-epilogue font-normal text-[14px] text-[#111111] dark:text-white">
                  {comment.message}
                </p>

                <div className="inline-flex gap-4">
                  <button
                    type="button"
                    className="text-[#111111] dark:text-white flex gap-1 items-center leading-none"
                  >
                    <span className="-mt-1">
                      <LikeOutlined />
                    </span>
                    0
                  </button>

                  <button
                    type="button"
                    className="text-[#111111] dark:text-white flex gap-1 items-center leading-none"
                  >
                    <span className="-mt-1">
                      <HeartOutlined />
                    </span>
                    0
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
