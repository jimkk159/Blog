import { useState, useRef } from "react";
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

export const extractYouTubeId = (url) => {
  const pattern =
    /(?:https?:\/\/(?:www\.)?)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|u\/\w\/|playlist\?list=)|youtu\.be\/)([^#]{11})/;

  const match = url.match(pattern);

  if (match && match[1]) return match[1];
  return;
};

export const onVideoEmbed = async (link, setMarkdown) => {
  const ytId = extractYouTubeId(link);
  const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;

  const insertedMarkdown = insertToTextArea(
    `**[![](${cover})](${link})**` +
      `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`
  );
  if (!insertedMarkdown) return;

  setMarkdown(insertedMarkdown);
};

export const onImageDrop = async (dataTransfer, setMarkdown) => {
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

function VideoChildren({ close, execute, getState, textApi, dispatch }) {
  const closeRef = useRef(null);
  const [value, setValue] = useState("");
  const css = `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;

  const isYt = (url) =>
    url && url.startsWith("https://www.youtube.com/watch?v=");

  const transToVideoLink = (url) => {
    const ytId = extractYouTubeId(url);
    const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;
    return `**[![](${cover})](${url})** ` + css;
  };

  const insertVideo = () => {
    const modifyText = transToVideoLink(value);
    textApi.replaceSelection(modifyText);
    closeRef.current.click();
  };

  const insert = () => {
    const state = getState();
    if (isYt(value)) insertVideo();
    else if (isYt(state.selectedText)) insertVideo(state.selectedText);
    setValue("");
  };

  return (
    <div style={{ width: 120, padding: 10 }}>
      <div>Embeded YT Link</div>
      <input type="text" onChange={(e) => setValue(e.target.value)} />
      <button type="button" onClick={insert}>
        Embeded Vieo
      </button>
      <button ref={closeRef} type="button" onClick={() => close()}>
        Close
      </button>
    </div>
  );
}

export const videoBtn = () =>
  commands.group([], {
    name: "video",
    groupName: "video",
    buttonProps: { "aria-label": "Insert title3" },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-play-btn"
        viewBox="0 0 16 16"
      >
        <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />{" "}
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
      </svg>
    ),
    children: (props) => <VideoChildren {...props} />,
    execute: async (state, api) => {
      let modifyText;
      const css = `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;
      const inputElement = document.getElementById("video-input");
      const inputValue = inputElement ? inputElement.value : null;

      const isYt = (url) =>
        url && url.startsWith("https://www.youtube.com/watch?v=");
      const transToVideoLink = (url) => {
        const ytId = extractYouTubeId(url);
        const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;
        return `**[![](${cover})](${url})**` + css;
      };

      if (isYt(inputValue)) {
        modifyText = transToVideoLink(inputValue);
        api.replaceSelection(modifyText);
        document.getElementById("video-close").click();
      } else if (isYt(state.selectedText)) {
        modifyText = transToVideoLink(state.selectedText);
        api.replaceSelection(modifyText);
        document.getElementById("video-close").click();
      }
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
  videoBtn(),
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
];