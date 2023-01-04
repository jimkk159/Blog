import React from "react";
import { FaCode, FaBold, FaItalic, FaUnderline, FaListUl, FaListOl } from "react-icons/fa";
import { RiBracesLine } from "react-icons/ri";
import { GrBlockQuote } from "react-icons/gr";

const blockTypes = [
  {
    label: "H1",
    style: "header-one",
  },
  {
    label: "H2",
    style: "header-two",
  },
  {
    label: "H3",
    style: "header-three",
  },
  {
    label: "H4",
    style: "header-four",
  },
  {
    label: "H5",
    style: "header-five",
  },
  {
    label: "H6",
    style: "header-six",
  },
  {
    label: "Blockquote",
    style: "blockquote",
    icon: <GrBlockQuote />,
  },
  {
    label: "UL",
    style: "unordered-list-item",
    icon: <FaListUl />,
  },
  {
    label: "OL",
    style: "ordered-list-item",
    icon: <FaListOl />,
  },
  {
    label: "Code Block",
    style: "code-block",
    icon: <FaCode />,
  },
];

const inlineStyles = [
  {
    label: "bold",
    style: "BOLD",
    icon: <FaBold />,
  },
  {
    label: "italic",
    style: "ITALIC",
    icon: <FaItalic />,
  },
  {
    label: "Underline",
    style: "UNDERLINE",
    icon: <FaUnderline />,
  },
  {
    label: "Monospace",
    style: "CODE",
    icon: <RiBracesLine />,
  },
];

export { blockTypes, inlineStyles };
