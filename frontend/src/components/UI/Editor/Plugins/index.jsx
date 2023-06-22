import Katex from "./Katex";
import Mermaid from "./Mermaid";

function Code({ className, children, ...props }) {

  if (typeof className === "string") {
    if (/^language-mermaid/.test(className.toLocaleLowerCase()))
      return <Mermaid className={className} children={children} {...props} />;
      
    else if (/^language-katex/.test(className.toLocaleLowerCase()))
      return <Katex className={className} children={children} {...props} />;
  }

  return <code className={String(className)}>{children}</code>;
}

export default Code;
