import {
  createCampaign,
  dashboard,
  gifts,
  globe,
  logout,
  payment,
  paymentPng,
  profile,
  withdraw,
} from "../assets";

export const navlinks = [
  {
    name: "all",
    title: "Trang chủ",
    imgUrl: globe,
    link: "/",
  },
  {
    name: "nearyou",
    title: "Gần bạn",
    imgUrl: paymentPng,
    link: "/nearyou-campaigns",
    // disabled: true,
  },
  {
    name: "mycampaigns",
    title: "Dự án của bạn",
    imgUrl: createCampaign,
    link: "/my-campaigns",
  },
  {
    name: "liked",
    title: "Dự án đã thích",
    imgUrl: withdraw,
    link: "/liked",
    // disabled: true,
  },
  {
    name: "subcribed",
    title: "Đã theo dõi",
    imgUrl: profile,
    link: "/subcribed",
  },
  {
    name: "logout",
    title: "Hủy kết nối ví",
    imgUrl: logout,
    link: "/logout",
  },
  {
    name: "gifts",
    title: "Gift Cards",
    imgUrl: gifts,
    link: "/gifts",
    color: "#577bff",
  },
];

export const initEditor = {
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
