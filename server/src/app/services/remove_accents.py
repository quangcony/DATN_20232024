import re

def remove_accents(input_str):
    if input_str:
        accents_map = [
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
        ]
        for accents in accents_map:
            char = accents[0]
            re_str = f"[{''.join(re.escape(c) for c in accents[1:])}]"
            input_str = re.sub(re_str, char, input_str)

        # Loại bỏ khoảng trắng và các ký tự trắng khỏi chuỗi
        input_str = re.sub(r'\s', ' ', input_str)

        return input_str
    else:
        return None
