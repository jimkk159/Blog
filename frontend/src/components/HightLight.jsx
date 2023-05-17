import SyntaxHighlighter from "react-syntax-highlighter";
import * as style from 'react-syntax-highlighter/dist/esm/styles/hljs';

const HightLight = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");

  return !inline && match ? (
    <SyntaxHighlighter
      {...props}
      language={match[1]}
      style={style.a11yDark}
      PreTag="div"
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
};

export default HightLight;
