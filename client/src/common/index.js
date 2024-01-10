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
    return str?.replaceAll(/\s/g, " ");
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
};

export const generateSlug = (str) => {
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
      str = str.toLowerCase().replace(re, char);
    }
    return str?.replaceAll(/\s/g, "-");
  } else {
    return;
  }
};

export const checkExpires = (time) => {
  const now = new Date().getTime();
  const distance = time - now;

  if (distance < 0) {
    return true;
  }

  return false;
};

// GET EDITOR CONTENT IMAGE FILE NAME
export const getAllImgNameContentEditor = (content) => {
  // GET ALL IMG TAG
  // REGULAR EXPRESSION FOR ALL IMG TAG
  const regexp = /<img[^>]*src="([^"]+)"[^>]*>/g;

  // 1. m[1]: FIND ALL IMG TAG MATCH => SECOND INDEX => VALUE OF SRC ATTRIBUTE
  // 2. split('/'): SPLIT BY / => ARRAY
  // 3. pop: GET LAST CHILD => IMAGE FILE NAME
  const fileNames = Array.from(content.matchAll(regexp), (m) =>
    m[1].split("/").pop()
  );

  return fileNames;
};
