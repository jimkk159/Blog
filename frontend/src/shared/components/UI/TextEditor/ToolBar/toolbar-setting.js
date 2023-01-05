import React from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaIndent,
  FaOutdent,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaUnlink,
  FaEraser,
  FaUndo,
  FaRedo,
  FaRegImage,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { AiOutlineFontSize } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";
import { RiBracesLine } from "react-icons/ri";
import { GrBlockQuote } from "react-icons/gr";
import { ImEmbed2 } from "react-icons/im";

export const inline = {
  type: "inline",
  inDropdown: false,
  options: ["bold", "italic", "strikethrough", "underline", "monospace"],
  bold: {
    label: "bold",
    style: "BOLD",
    icon: <FaBold />,
  },
  italic: {
    label: "italic",
    style: "ITALIC",
    icon: <FaItalic />,
  },
  strikethrough: {
    label: "strikethrough",
    style: "STRIKETHROUGH",
    icon: <FaStrikethrough />,
  },
  underline: {
    label: "Underline",
    style: "UNDERLINE",
    icon: <FaUnderline />,
  },
  monospace: {
    label: "Monospace",
    style: "CODE",
    icon: <RiBracesLine />,
  },
};
export const blockType2 = {
  type: "blockType",
  inDropdown: false,
  options: ["Blockquote", "Code"],
  Blockquote: {
    label: "Blockquote",
    style: "blockquote",
    icon: <GrBlockQuote />,
  },
  Code: {
    label: "Code Block",
    style: "code-block",
    icon: <BiCodeBlock />,
  },
};
export const blockType = {
  type: "blockType",
  inDropdown: true,
  options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
  Normal: { label: "Normal", style: "unstyled" },
  H1: {
    label: "H1",
    style: "header-one",
  },
  H2: {
    label: "H2",
    style: "header-two",
  },
  H3: {
    label: "H3",
    style: "header-three",
  },
  H4: {
    label: "H4",
    style: "header-four",
  },
  H5: {
    label: "H5",
    style: "header-five",
  },
  H6: {
    label: "H6",
    style: "header-six",
  },
};

export const fontSize = {
  type: "inline",
  inDropdown: true,
  icon: <AiOutlineFontSize />,
  options: [12, 24, 30],
  12: {
    label: "12",
    style: "FONT_SIZE_12",
    icon: <AiOutlineFontSize />,
  },
  24: {
    label: "14",
    style: "FONT_SIZE_24",
    icon: <AiOutlineFontSize />,
  },
  30: {
    label: "16",
    style: "FONT_SIZE_30",
    icon: <AiOutlineFontSize />,
  },
};

export const fontFamily = {
  type: "inline",
  inDropdown: true,
  options: ["Arial", "Georgia", "Impact", "Tahoma", "TimesNewRoman", "Verdana"],
  Arial: {
    label: "Arial",
    style: "Arial",
  },
  Georgia: {
    label: "Georgia",
    style: "Georgia",
  },
  Impact: {
    label: "Impact",
    style: "Impact",
  },
  Tahoma: {
    label: "Tahoma",
    style: "Tahoma",
  },
  TimesNewRoman: {
    label: "Times New Roman",
    style: "TimesNewRoman",
  },
  Verdana: {
    label: "Verdana",
    style: "Verdana",
  },
};
export const list = {
  type: "blockType",
  inDropdown: false,
  options: ["unordered", "ordered", "indent", "outdent"],
  unordered: {
    label: "unordered",
    style: "unordered-list-item",
    icon: <FaListUl />,
  },
  ordered: {
    label: "ordered",
    style: "ordered-list-item",
    icon: <FaListOl />,
  },
  indent: {
    label: "indent",
    style: "ordered-list-item",
    icon: <FaIndent />,
  },
  outdent: {
    label: "outdent",
    style: "ordered-list-item",
    icon: <FaOutdent />,
  },
};
export const textAlign = {
  type: "blockType",
  inDropdown: false,
  options: ["left", "center", "right", "justify"],
  left: { label: "left", style: "Align_Left", icon: <FaAlignLeft /> },
  center: { label: "center", style: "Align_Center", icon: <FaAlignCenter /> },
  right: { label: "right", style: "Align_Right", icon: <FaAlignRight /> },
  justify: {
    label: "justify",
    style: "Align_Justify",
    icon: <FaAlignJustify />,
  },
};

export const link = {
  type: "",
  inDropdown: false,
  options: ["link", "unlink"],
  link: { label: "link", style: "link", icon: <FaLink /> },
  unlink: { label: "unlink", style: "unlink", icon: <FaUnlink /> },
  linkCallback: undefined,
};
export const embedded = {
  type: "",
  inDropdown: false,
  options: ["embedded"],
  embedded: { label: "embedded", style: "", icon: <ImEmbed2 /> },
};
export const remove = {
  type: "",
  inDropdown: false,
  options: ["remove"],
  remove: { label: "remove", style: "", icon: <FaEraser /> },
};
export const history = {
  type: "",
  inDropdown: false,
  options: ["undo", "redo"],
  undo: { label: "undo", style: "", icon: <FaUndo /> },
  redo: { label: "redo", style: "", icon: <FaRedo /> },
};
export const image = {
  type: "",
  inDropdown: false,
  options: ["image"],
  image: { label: "image", style: "", icon: <FaRegImage /> },
};
export const map = {
  type: "",
  inDropdown: false,
  options: ["map"],
  map: { label: "map", style: "", icon: <FaMapMarkedAlt /> },
};
export const toolbar = {
  options: [
    "inline",
    "blockType2",
    "blockType",
    "fontSize",
    "fontFamily",
    // "list",
    // "textAlign",
    // "link",
    // "remove",
    // "embedded",
    // "history",
    "image",
    "map",
  ],
  inline: inline,
  blockType2: blockType2,
  blockType: blockType,
  fontSize: fontSize,
  fontFamily: fontFamily,
  list: list,
  textAlign: textAlign,
  link: link,
  remove: remove,
  embedded: embedded,
  history: history,
  image: image,
  map: map,
};
