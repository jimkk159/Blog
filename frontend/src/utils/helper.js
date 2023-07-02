import { v4 as uuid } from "uuid";
import * as helper from "../utils/helper";
import * as authHelper from "../utils/auth";
import { HashLink } from "react-router-hash-link";

const defaultCover = [
  // "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/default-cover.jpg",
  "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/default-cover-2.jpg",
  // "https://jimkk159-blog-img.s3.ap-northeast-1.amazonaws.com/default-cover-3.jpg",
];

export const hasPermissionToPost = ({ auth, AuthorId }) => {
  const token = authHelper.getAuthToken();
  return token && (auth.isRoot || AuthorId === auth.id);
};

export const hasPermissionToAbout = (auth) =>
  authHelper.getAuthToken() && auth.isRoot;

export const convertContentSyntax = async (content) =>
  content.replaceAll("", "<");

export const uploadImg = async (img) => {
  const token = authHelper.getAuthToken();

  const imgForm = new FormData();
  imgForm.append("img", img);

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/img`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: imgForm,
    }
  ).catch((err) => err);

  const resJSON = await response.json();
  if (!(resJSON && resJSON.data && resJSON.data.img)) return;

  return resJSON.data.img;
};

export const creatPreviewImg = (img) => {
  if (!img) {
    const randomIndex = Math.floor(Math.random() * defaultCover.length);
    return defaultCover[randomIndex];
  }
  return img;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const slugify = (text) => {
  // Remove emojis from the title
  const titleWithoutEmojis = text.replace(
    /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    ""
  );

  // Replace " - " with "--"
  const replacedTitle = titleWithoutEmojis.replace(/\s-\s/g, "--");

  // Replace white spaces with hyphens and keep only English words
  const cleanedTitle = replacedTitle
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return cleanedTitle;
};

export const createChapterHashLink = (line) => {
  const tags = ["# ", "## ", "### ", "#### ", "##### ", "###### "];
  const padding = ["", "pl-2", "pl-2", "pl-4", "pl-4", "pl-6"];

  for (let i = 0; i < tags.length; i++) {
    if (line.startsWith(tags[i])) {
      const chapter = line.replace(tags[i], "");
      const slugTag = slugify(chapter);

      return (
        <li
          key={uuid()}
          className={`${padding[i]} truncate `}
          title={`${chapter}`}
        >
          <HashLink
            to={`#${slugTag}`}
            className="underline hover:text-white lg:text-sm xl:text-base"
            smooth
          >
            {chapter}
          </HashLink>
        </li>
      );
    }
  }
};

export const createPostCatalogue = (postContent) => {
  const lines = postContent.split("\n").filter((el) => el.startsWith("#"));

  return lines.map((line) => {
    if (line) return helper.createChapterHashLink(line);
    return null;
  });
};
