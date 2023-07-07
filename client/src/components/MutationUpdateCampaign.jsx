import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { Button, Modal } from "antd";
import FormField from "./FormField";
import { checkIfImage } from "../utils";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const MutationUpdateCampaign = ({ isModalOpen, setIsModalOpen, data }) => {
  const navigate = useNavigate();
  const { editCampaign } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    pId: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        pId: data.pId,
        content: data.content,
        image: data.image,
      });
    }
  }, [data]);

  const handleFormFieldChange = (fieldName, e) => {
    if (fieldName === "content") {
      setForm({ ...form, [fieldName]: e });
    } else {
      setForm({ ...form, [fieldName]: e.target.value });
    }
  };

  const handleCancel = () => {
    setForm({
      pId: "",
      content: "",
      image: "",
    });
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await editCampaign({
          ...form,
        });
        handleCancel();
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Đường dẫn ảnh không hợp lệ!");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <Modal
          width={900}
          title="Sửa dự án"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          style={{
            top: 20,
          }}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{
                backgroundColor: "#EA2027",
              }}
              onClick={handleOk}
            >
              Cập nhật
            </Button>,
          ]}
        >
          <form className="w-full flex flex-col gap-[30px]">
            <FormField
              labelName="Câu chuyện *"
              isTextEditor
              value={form.content}
              handleChange={(e) => handleFormFieldChange("content", e)}
            />

            <FormField
              labelName="Hình ảnh dự án *"
              placeholder="Đặt đường dẫn hình ảnh về dự án"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange("image", e)}
            />
          </form>
        </Modal>
      )}
    </>
  );
};

export default MutationUpdateCampaign;
