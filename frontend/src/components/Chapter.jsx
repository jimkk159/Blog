import { HashLink } from "react-router-hash-link";

const padding = ["", "pl-2", "pl-2", "pl-4", "pl-4", "pl-6"];
const fontSize = ["24", "20", "18", "16", "14", "12"];
const headingElements = ["# ", "## ", "### ", "#### ", "##### ", "###### "];

function Chapters({ post }) {
  const chapters = [];
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
                <li key={chapter} className={`${padding[i]} my-1.5`}>
                  <HashLink
                    to={`#${slugTag}`}
                    className={`text-[${fontSize[i]}px] underline`}
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
    <div className="border-l-2 border-gray-400 bg-gray-950 px-2 pt-24 pb-4">
      <div className="w-40 pl-3 pr-6">
        <ul>{chapters}</ul>
      </div>
    </div>
  );
}

export default Chapters;
