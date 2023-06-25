import katex from "katex";
import "katex/dist/katex.css";
import { getCodeString } from "rehype-rewrite";

function Katex({ className, inline, children = [], ...props }) {
  const txt = children[0] || "";
  if (inline) {
    if (typeof txt === "string" && /^\$\$(.*)\$\$/.test(txt)) {
      const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, "$1"), {
        throwOnError: false,
      });
      return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return <code>{txt}</code>;
  }
  const code =
    props.node && props.node.children
      ? getCodeString(props.node.children)
      : txt;

  if (
    typeof code === "string" &&
    typeof className === "string" &&
    /^language-katex/.test(className.toLocaleLowerCase())
  ) {
    const html = katex.renderToString(code, {
      throwOnError: false,
    });
    return (
      <code
        style={{ fontSize: "150%" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
}

export default Katex;
