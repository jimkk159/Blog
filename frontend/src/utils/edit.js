import { useState, useRef } from "react";
import * as helper from "./helper";
import { commands } from "@uiw/react-md-editor";

export const onImageUpload = async (file, api) => {
  const url = await helper.uploadImg(file);

  const insertedMarkdown =
    `**![](${url})**` +
    `<!--rehype:style=display: flex; justify-content: center; width: 100%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;
  if (!insertedMarkdown) return;

  api.replaceSelection(insertedMarkdown);
};

export const onImageUpload2 = async (file, setMarkdown) => {
  const url = await helper.uploadImg(file);

  const insertedMarkdown =
    `**![](${url})**` +
    `<!--rehype:style=display: flex; justify-content: center; width: 100%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;
  if (!insertedMarkdown) return;

  setMarkdown((prev) => prev + insertedMarkdown);
};

export const extractYouTubeId = (url) => {
  const pattern =
    /(?:https?:\/\/(?:www\.)?)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|u\/\w\/|playlist\?list=)|youtu\.be\/)([^#]{11})/;

  const match = url.match(pattern);

  if (match && match[1]) return match[1];
  return;
};

// export const onVideoEmbed = async (link, setMarkdown) => {
//   const ytId = extractYouTubeId(link);
//   const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;

//   const insertedMarkdown = insertToTextArea(
//     `**[![](${cover})](${link})**` +
//       `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`
//   );
//   if (!insertedMarkdown) return;
//   setMarkdown(insertedMarkdown);
// };

export const onImageDrop = async (dataTransfer, setMarkdown) => {
  const files = [];

  for (let index = 0; index < dataTransfer.items.length; index++) {
    const file = dataTransfer.files.item(index);
    if (file) files.push(file);
  }

  await Promise.all(
    files.map(async (file) => onImageUpload2(file, setMarkdown))
  );
};

export const imgBtn = (inputRef, textApiRef) => ({
  name: "Text To Image",
  keyCommand: "text2image",
  render: (command, disabled, executeCommand) => {
    return (
      <button
        type="button"
        aria-label="Insert title3"
        disabled={disabled}
        onClick={() => {
          executeCommand(command, command.groupName);
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
  execute: (state, api) => {
    inputRef.current.click();
    textApiRef.current = api;
  },
});

function VideoChildren({ close, execute, getState, textApi, dispatch }) {
  const closeRef = useRef(null);
  const [value, setValue] = useState("");
  // const css = `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;

  const isYt = (url) =>
    url && url.startsWith("https://www.youtube.com/watch?v=");

  // const transToVideoLink = (url) => {
  //   const ytId = extractYouTubeId(url);
  //   const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;
  //   return `**[![](${cover})](${url})** ` + css;
  // };

  const transToVideoIframe = (url) => {
    const ytId = extractYouTubeId(url);
    return `<div class="flex justify-center mx-auto my-1" style="width: 75%; max-width: 500px;"><div class="relative flex justify-cneter w-full h-0" style="min-height: 100px; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${ytId}" frameborder="0" sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation" allowfullscreen="" 
  class="absolute left-0 top-0 w-full h-full rounded-sm pointer-events-auto bg-[rgb(25, 25, 25)]"
  ></iframe></div></div>`;
  };

  const insertVideo = () => {
    const modifyText = transToVideoIframe(value);
    textApi.replaceSelection(modifyText);
    closeRef.current.click();
  };

  const insert = () => {
    const state = getState();
    if (isYt(value)) insertVideo(value);
    else if (isYt(state.selectedText)) insertVideo(state.selectedText);
    setValue("");
  };

  return (
    <div className="w-40 p-3">
      <div className="font-kanit">Embeded YT Link</div>
      <input
        type="text"
        className="mx-0 my-1.5 box-border h-6 w-full overflow-ellipsis rounded-sm border border-gray-400 bg-[#f8f8f8] px-1.5 text-base outline-none focus:bg-[#ebebeb]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex justify-start">
        <button
          type="button"
          className="my-1.5 mr-1 box-border h-6 rounded border border-gray-500 px-1 py-0.5 text-center font-kanit text-sm hover:bg-gray-100"
          onClick={insert}
        >
          Embeded
        </button>
        <button
          ref={closeRef}
          type="button"
          className="my-1.5 mr-1 box-border h-6 rounded border border-gray-500 px-1 py-0.5 text-center font-kanit text-sm hover:bg-gray-100"
          onClick={() => close()}
        >
          Close
        </button>
      </div>
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
    // execute: async (state, api) => {
    //   let modifyText;
    //   // const css = `<!--rehype:style=display: flex; justify-content: center; width: 50%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->`;
    //   const inputElement = document.getElementById("video-input");
    //   const inputValue = inputElement ? inputElement.value : null;

    //   const isYt = (url) =>
    //     url && url.startsWith("https://www.youtube.com/watch?v=");

    //   // const transToVideoLink = (url) => {
    //   //   const ytId = extractYouTubeId(url);
    //   //   const cover = `https://i.ytimg.com/vi/${ytId}/hq720.jpg`;
    //   //   return `**[![](${cover})](${url})**` + css;
    //   // };

    //   const transToVideoIframe = (url) => {
    //     const ytId = extractYouTubeId(url);
    //     return `<div class="relative flex justify-cneter w-full h-0" style="min-height: 100px; padding-bottom: 56.25%;"><iframe src="https://www.youtube.com/embed/${ytId}" frameborder="0" sandbox="allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin allow-storage-access-by-user-activation" allowfullscreen=""
    //   class="absolute left-0 top-0 w-full h-full rounded-sm pointer-events-auto bg-[rgb(25, 25, 25)]"
    //   ></iframe></div>`;
    //   };
    //   if (isYt(inputValue)) {
    //     modifyText = transToVideoIframe(inputValue);
    //     api.replaceSelection(modifyText);
    //     document.getElementById("video-close").click();
    //   } else if (isYt(state.selectedText)) {
    //     modifyText = transToVideoIframe(state.selectedText);
    //     api.replaceSelection(modifyText);
    //     document.getElementById("video-close").click();
    //   }
    // },
  });

export const editChoice = (inputRef, textApiRef) => [
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
  imgBtn(inputRef, textApiRef),
  videoBtn(),
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
];

export const getNotRootCategoryId = (array) => {
  const filteredArray = array.filter((item) => +item !== 1);
  const sortedArray = filteredArray.sort((a, b) => a - b);
  return sortedArray[0];
};
