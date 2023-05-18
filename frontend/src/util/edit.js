import * as helper from "./helper";
import { commands } from "@uiw/react-md-editor";

export const insertToTextArea = (intsertString) => {
  const textarea = document.querySelector("textarea");
  if (!textarea) return null;

  let sentence = textarea.value;
  const len = sentence.length;
  const pos = textarea.selectionStart;
  const end = textarea.selectionEnd;

  const front = sentence.slice(0, pos);
  const back = sentence.slice(pos, len);

  sentence = front + intsertString + back;

  textarea.value = sentence;
  textarea.selectionEnd = end + intsertString.length;

  return sentence;
};

export const onImageUpload = async (file, setMarkdown) => {
  const url = await helper.uploadImg(file);

  const insertedMarkdown = insertToTextArea(
    `**![](${url})**` +
      `<!--rehype:style=display: flex; justify-content: center; width: 100%; max-width: 1041px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`
  );
  if (!insertedMarkdown) return;

  setMarkdown(insertedMarkdown);
};

export const onImagePasted = async (dataTransfer, setMarkdown) => {
  const files = [];

  for (let index = 0; index < dataTransfer.items.length; index++) {
    const file = dataTransfer.files.item(index);
    if (file) files.push(file);
  }

  await Promise.all(
    files.map(async (file) => onImageUpload(file, setMarkdown))
  );
};

export const imgBtn = (inputRef) => ({
  name: "Text To Image",
  keyCommand: "text2image",
  render: (command, disabled, executeCommand) => {
    return (
      <button
        aria-label="Insert title3"
        disabled={disabled}
        onClick={() => {
          inputRef.current.click();
        }}
      >
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
          ></path>
        </svg>
      </button>
    );
  },
});

export const editChoice = (inputRef) => [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.title,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.comment,
  imgBtn(inputRef),
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
];
