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
  FaUndo,
  FaRedo,
  FaRegImage,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { BsFillEraserFill } from "react-icons/bs";
import { RiBracesLine } from "react-icons/ri";
import { GrBlockQuote } from "react-icons/gr";
import { ImEmbed2 } from "react-icons/im";

export const inline = {
  type: "inline",
  inDropdown: false,
  options: ["bold", "italic", "strikethrough", "underline", "monospace"],
  choices: {
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
  },
};
export const blockTypeFlat = {
  type: "blockType",
  inDropdown: false,
  options: ["Blockquote", "Code"],
  choices: {
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
  },
};
export const blockTypeDrop = {
  type: "blockType",
  inDropdown: true,
  options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
  choices: {
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
  },
};
export const fontSize = {
  type: "fontSize",
  inDropdown: true,
  options: [8, 10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
};
export const fontFamily = {
  type: "inline",
  inDropdown: true,
  options: ["Arial", "Georgia", "Impact", "Tahoma", "TimesNewRoman", "Verdana"],
  choices: {
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
  },
};
export const list = {
  type: "blockType",
  inDropdown: false,
  options: ["unordered", "ordered"],
  choices: {
    unordered: {
      label: "unorder-list",
      style: "unordered-list-item",
      icon: <FaListUl />,
    },
    ordered: {
      label: "order-list",
      style: "ordered-list-item",
      icon: <FaListOl />,
    },
  },
};
export const indent = {
  type: "indent",
  inDropdown: false,
  options: ["indent", "outdent"],
  choices: {
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
  },
};
export const textAlign = {
  type: "blockType",
  inDropdown: false,
  options: ["left", "center", "right", "justify"],
  choices: {
    left: { label: "left", style: "ALIGN_LEFT", icon: <FaAlignLeft /> },
    center: { label: "center", style: "ALIGN_CENTER", icon: <FaAlignCenter /> },
    right: { label: "right", style: "ALIGN_RIGHT", icon: <FaAlignRight /> },
    justify: {
      label: "justify",
      style: "ALIGN_JUSTIFY",
      icon: <FaAlignJustify />,
    },
  },
};
export const link = {
  type: "blockType",
  inDropdown: false,
  options: ["link", "unlink"],
  choices: {
    link: { label: "link", style: "link", icon: <FaLink /> },
    unlink: { label: "unlink", style: "unlink", icon: <FaUnlink /> },
  },
  linkCallback: undefined,
};
export const embedded = {
  type: "blockType",
  inDropdown: false,
  options: ["embedded"],
  choices: { embedded: { label: "embedded", style: "", icon: <ImEmbed2 /> } },
};
export const remove = {
  type: "remove",
  inDropdown: false,
  options: ["remove"],
  choices: {
    remove: { label: "remove", style: "", icon: <BsFillEraserFill /> },
  },
};
export const history = {
  type: "history",
  inDropdown: false,
  options: ["undo", "redo"],
  choices: {
    undo: { label: "undo", style: "", icon: <FaUndo /> },
    redo: { label: "redo", style: "", icon: <FaRedo /> },
  },
};
export const image = {
  type: "blockType",
  inDropdown: false,
  options: ["image"],
  choices: { image: { label: "image", style: "", icon: <FaRegImage /> } },
};
export const map = {
  type: "blockType",
  inDropdown: false,
  options: ["map"],
  choices: { map: { label: "map", style: "", icon: <FaMapMarkedAlt /> } },
};
export const toolbar = {
  options: [
    ["inline", "blockTypeFlat", "blockTypeDrop", "fontSize", "fontFamily"],
    [
      "textAlign",
      "list",
      "indent",
      "link",
      "image",
      "map",
      "embedded",
      "remove",
      "history",
    ],
  ],
  features: {
    inline: inline,
    blockTypeFlat: blockTypeFlat,
    blockTypeDrop: blockTypeDrop,
    fontSize: fontSize,
    fontFamily: fontFamily,
    list: list,
    indent: indent,
    textAlign: textAlign,
    link: link,
    remove: remove,
    embedded: embedded,
    history: history,
    image: image,
    map: map,
  },
};
