import mermaid from "mermaid";
import { v4 as uuid } from "uuid";
import React, { useRef, useEffect, useCallback } from "react";

const getCode = (arr = []) =>
  arr
    .map((dt) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

function Mermaid({ inline, children = [], className, ...props }) {
  const svgId = useRef("svg" + uuid().replaceAll("-"));
  const code = getCode(children);
  const container = useRef(null);

  const handleMermaid = useCallback(async () => {
    try {
      const { svg } = await mermaid.render(svgId.current, code);
      container.current.innerHTML = svg;
    } catch (error) {
      container.current.innerHTML = error;
    }
  }, [code, svgId]);

  useEffect(() => {
    if (container.current) {
      handleMermaid();
    }
  }, [handleMermaid]);

  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-mermaid/.test(className.toLocaleLowerCase())
  ) {
    return (
      <code ref={container}>
        <code id={svgId.current} style={{ display: "none" }} />
      </code>
    );
  }
  return null
}

export default Mermaid;
