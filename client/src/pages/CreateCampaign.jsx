import React, { useEffect, useState } from "react";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField } from "../components";
import { checkIfImage } from "../utils";
import NoConnectWallet from "../components/NoConnectWallet";
import CreateTags from "../components/CreateTags";
import Loading from "../components/Loading";
import crowdfundingApi from "../api/crowdfundingApi";
import NotiModal from "../components/NotiModal";
import { Link } from "react-router-dom";

const CreateCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { address, createCampaign } = useStateContext();
  const [tags, setTags] = useState([]);
  const [logged, setLogged] = useState(localStorage.getItem("profile"));
  const [profile, setProfile] = useState();

  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    target: "",
    deadline: "",
    image: "",
    videoUrl: "",
    ownerAddress: "",
    createdBy: "",
  });

  useEffect(() => {
    if (logged) {
      setProfile(JSON.parse(localStorage.getItem("profile")));
    }
  }, [logged]);

  const handleFormFieldChange = (fieldName, e) => {
    if (fieldName === "content") {
      console.log("content::", e);
      setForm({ ...form, [fieldName]: e });
    } else {
      setForm({ ...form, [fieldName]: e.target.value });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        try {
          const res = await createCampaign({
            ...form,
            tags: tags,
            createdBy: profile._id,
          });
          if (res) {
            await crowdfundingApi.updateUser(profile._id, {
              noCampaign: profile.noCampaign + 1,
            });
            setIsLoading(false);
            setForm({
              title: "",
              description: "",
              content: "",
              target: "",
              deadline: "",
              image: "",
              videoUrl: "",
              ownerAddress: "",
            });
            setIsModalOpen(true);
          }
        } catch (error) {
          setIsLoading(false);
          alert("Không thể tạo chiến dịch!");
        }
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  if (!profile) {
    return (
      <h1 className="font-epilogue font-bold text-[18px] text-[#111111] dark:text-white">
        Bạn chưa đăng nhập!
      </h1>
    );
  }

  return (
    <div className="bg-[#f2f2f2] dark:bg-[#1c1c24] flex justify-center items-center flex-col rounded-[4px] sm:p-10 p-4">
      {isLoading && <Loading content={"Đang tạo chiến dịch.. "} />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#009432] rounded-[4px]">
        <h1 className="font-epilogue font-bold sm:text-[24px] text-[18px] leading-[38px] text-white">
          Bắt đầu một dự án
        </h1>
      </div>
      <NotiModal
        title={"Thành công!"}
        content={"Chiến dịch của bạn đã được tạo."}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        {/* <div className="flex flex-wrap gap-[40px]"> */}
        <FormField
          labelName="Tên dự án *"
          placeholder="vd: xây dựng lớp học"
          inputType="text"
          value={form.title}
          handleChange={(e) => handleFormFieldChange("title", e)}
        />
        {/* <FormField
            labelName="Slug *"
            inputType="text"
            value={form.slug}
            handleFocus={(e) => handleFormFieldFocus("slug", e)}
          /> */}
        {/* </div> */}

        <FormField
          labelName="Mô tả *"
          placeholder="Mô tả ngắn gọn về dự án"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <FormField
          labelName="Câu chuyện *"
          isTextEditor
          value={form.content}
          handleChange={(e) => handleFormFieldChange("content", e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#57606f] h-[120px] rounded-[4px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[22px] text-white ml-[20px]">
            Số tiền huy động được sẽ sử dụng cho mục đích cộng đồng
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Mục tiêu *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            labelName="Ngày kết thúc *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>
        <FormField
          labelName="Hình ảnh dự án *"
          placeholder="Đặt đường dẫn hình ảnh về dự án"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Video giới thiệu*"
            placeholder="Đường dẫn video"
            inputType="url"
            value={form.videoUrl}
            handleChange={(e) => handleFormFieldChange("videoUrl", e)}
          />
          <FormField
            labelName="Địa chỉ nhận hỗ trợ *"
            placeholder="VD: 0xa73B10dC969a376cF1F140e4E2C2ccea1b6d86eE"
            inputType="text"
            value={form.ownerAddress}
            handleChange={(e) => handleFormFieldChange("ownerAddress", e)}
          />
        </div>

        <div>
          <p className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
            Hashtag *
          </p>
          <div className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white rounded-[4px] sm:min-w-[300px]">
            <CreateTags tags={tags} setTags={setTags} />
          </div>
        </div>

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Khởi tạo dự án"
            styles="bg-[#009432] text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
