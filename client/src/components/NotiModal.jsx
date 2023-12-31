import { Modal } from "antd";
import React from "react";
import CustomButton from "./CustomButton";

const NotiModal = ({ title, content, isModalOpen, setIsModalOpen }) => {
  return (
    <Modal
      className="modal-show"
      style={{ textAlign: "center" }}
      centered
      width={500}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <div key="back" className="flex justify-center">
          <CustomButton
            btnType="button"
            title="Đóng"
            styles="bg-[#009432] text-white px-8"
            handleClick={() => setIsModalOpen(false)}
          />
        </div>,
      ]}
    >
      <h2 className="font-semibold text-[24px] mb-5">{title}</h2>
      <p className="text-[14px] leading-5 mb-5 text-slate-600">{content}</p>
    </Modal>
  );
};

export default NotiModal;
