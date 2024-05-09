import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select } from "antd";

const AddUser = (props) => {

const { visible, setVisible, onCreate } = props;
const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [form] = Form.useForm();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      open={visible}
      title="Tạo người dùng mới"
      okText="Ok"
      onCancel={() => {
        setVisible(false);
      }}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên tổ chức"
          name="name"
          rules={[
            { required: true, message: "Please input the name of your organization!" }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input type="textarea" />
        </Form.Item>

        <Form.Item name="genres" label="Sở thích">
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              size="large"
              bordered={false}
            //   onChange={(val) => handleFormFieldChange("genres", val)}
              options={[]}
            />
        </Form.Item>

        <Form.Item name="avatar" label="Avatar">
            <input
            //   value={value}
              onChange={handleFileChange}
            //   onFocus={handleFocus}
            type={"file"}
            //   placeholder={placeholder}
            multiple={false}
            className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[4px] sm:min-w-[300px]"
            />
            <div>{selectedFile && <img src={preview} width={250} />}</div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddUser