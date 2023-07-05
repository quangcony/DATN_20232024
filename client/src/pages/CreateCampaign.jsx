import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";
import NoConnectWallet from "../components/NoConnectWallet";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { address, createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    content: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    if (fieldName === "content") {
      setForm({ ...form, [fieldName]: e });
    } else {
      setForm({ ...form, [fieldName]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  if (!address) {
    return <NoConnectWallet />;
  }

  return (
    <div className="bg-[#f2f2f2] dark:bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 mt-[20px]">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-white dark:bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-[#111111] dark:text-white">
          Bắt đầu một chiến dịch
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Tên của bạn *"
            placeholder="Dang Ngoc Quang"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            labelName="Tên chiến dịch *"
            placeholder="vd: xây dựng lớp học"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>

        <FormField
          labelName="Mô tả *"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <FormField
          labelName="Content *"
          isTextEditor
          value={form.content}
          handleChange={(e) => handleFormFieldChange("content", e)}
        />

        {/* <TextEditor  ref={editorRef} /> */}

        <div className="w-full flex justify-start items-center p-4 bg-[#57606f] h-[120px] rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
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
          labelName="Hình ảnh chiến dịch *"
          placeholder="Đặt đường dẫn hình ảnh về chiến dịch"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Khởi tạo dự án"
            styles="bg-[#EA2027]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
