import React from "react";
import { initEditor } from "../constants";
import { Editor } from "@tinymce/tinymce-react";

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  isTextEditor,
  value,
  handleChange,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          spellCheck={false}
          required
          value={value}
          onChange={handleChange}
          rows={6}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : isTextEditor ? (
        <Editor
          init={{
            ...initEditor,
            content_style: "body { color: white;}",
          }}
          apiKey="5w25io080e8yu2xtqzc9c445z9bsvb0qpuyukm17cwc9dmng"
          value={value}
          onEditorChange={handleChange}
        />
      ) : (
        <input
          required
          spellCheck={false}
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#111111] dark:text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default FormField;
