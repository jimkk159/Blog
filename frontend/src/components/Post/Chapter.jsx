import { HashLink } from "react-router-hash-link";
import { useMediaQuery } from "react-responsive";

const padding = ["", "pl-2", "pl-2", "pl-4", "pl-4", "pl-6"];
const fontSize = ["14", "12", "10", "8", "6", "4"];
const headingElements = ["# ", "## ", "### ", "#### ", "##### ", "###### "];

function Chapters({ post }) {
  const chapters = [];
  const matches = useMediaQuery({ query: "(min-width: 1280px)" });

  if (post) {
    const lines = post.content.split("\n").filter((el) => el.startsWith("#"));
    lines.forEach((line) => {
      if (line) {
        const chapterFactoryHandler = (tags) => (line) => {
          for (let i = 0; i < tags.length; i++) {
            if (line.startsWith(tags[i])) {
              const chapter = line.replace(tags[i], "");
              const slugTag = chapter.replaceAll(" ", "-");

              return (
                <li
                  key={chapter}
                  className={`${padding[i]} my-1 truncate xl:my-3`}
                  title={`${chapter}`}
                >
                  <HashLink
                    to={`#${slugTag}`}
                    className={`underline`}
                    style={{ fontSize: `${+fontSize[i] + +matches * 6}px` }}
                    smooth
                  >
                    {chapter}
                  </HashLink>
                </li>
              );
            }
          }
        };
        const chapterElement = chapterFactoryHandler(headingElements)(line);
        if (chapterElement) chapters.push(chapterElement);
      }
    });
  }

  return (
    <div className="hidden border-l-2 border-gray-400 bg-gray-950 px-4 pb-4 pt-[86px] lg:block">
      <div className="border-t-2 border-gray-300 py-2 lg:w-28 xl:w-40">
        <ul>{chapters}</ul>
      </div>
    </div>
  );
}

export default Chapters;
