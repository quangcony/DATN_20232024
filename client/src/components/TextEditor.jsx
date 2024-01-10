import { Editor } from "@tinymce/tinymce-react";
import React, { forwardRef, useState } from "react";
import crowdfundingApi from "../api/crowdfundingApi";

const initEditor = {
  branding: false,
  plugins:
    "preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
  mobile: {
    plugins:
      "preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons",
  },
  menu: {
    tc: {
      title: "Comments",
      items: "addcomment showcomments deleteallconversations",
    },
  },
  menubar: "file edit view insert format tools table tc help",
  toolbar:
    "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor casechange removeformat | pagebreak | charmap emoticons | fullscreen  preview save  | insertfile image media link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  autosave_restore_when_empty: false,
  autosave_retention: "2m",
  image_advtab: true,
  importcss_append: true,
  height: 400,
  image_caption: true,
  quickbars_selection_toolbar:
    "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
  toolbar_mode: "sliding",
  content_style: ".mymention{ color: gray; }",
  contextmenu: "link image table configurepermanentpen",
  a11y_advanced_options: true,
  images_reuse_filename: true,
};

const TextEditor = (props, ref) => {
  const { initialValue, setFilesTemp } = props;
  const [value, setValue] = useState("");

  const imageUploadHandler = async (blobInfo, progress) => {
    let formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    try {
      let res = await crowdfundingApi.uploadFile(formData);
      if (res.data) {
        setFilesTemp((prevFilesTemp) => [
          ...prevFilesTemp,
          blobInfo.filename(),
        ]);
        return res.data.fileName;
      }
    } catch (error) {
      console.log("error::", error);
    }
  };

  return (
    <Editor
      ref={ref}
      apiKey={"5w25io080e8yu2xtqzc9c445z9bsvb0qpuyukm17cwc9dmng"}
      initialValue={initialValue ? initialValue : ""}
      value={value}
      init={{
        ...initEditor,
        content_style: "body { color: white;}",
        images_upload_handler: imageUploadHandler,
      }}
      onEditorChange={(value) => setValue(value)}
    />
  );
};

export default forwardRef(TextEditor);
