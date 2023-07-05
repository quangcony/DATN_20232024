// Validate input value to search in HeadBar componetnt.
export const removeAccents = (str) => {
  if (str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ",
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substring(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str?.replaceAll(/\s/g, "");
  } else {
    return;
  }
};

export const truncateMiddleText = (text) => {
  const length = text.length;
  const textTruncate =
    text.substring(0, 5) + "..." + text.substring(length - 4);

  return textTruncate;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Sao chép thành công!");
};
