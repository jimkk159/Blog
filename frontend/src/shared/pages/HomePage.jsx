import React from "react";
import { useSelector } from "react-redux";

//Image
import coverImage1 from "../../assets/img/cover/1.webp";
import coverImage2 from "../../assets/img/cover/2.webp";

//Custom Component
import Quote from "../components/Quote";
import PostInfo from "../../blogs/components/PostInfo";

//CSS
import classes from "./HomePage.module.css";

const options = { year: "numeric", month: "short", day: "numeric" };
const Dummy_blogs = [
  {
    title: "Test title 1",
    cover: coverImage1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2022-11-28").toLocaleDateString("en-US", options),
    author: "Amy",
    tag: "CS",
    isPined: true,
  },
  {
    title: "Test title 2",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 3",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 4",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 5",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 6",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 7",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 8",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 9",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 10",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 11",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
  {
    title: "Test title 12",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
    isPined: false,
  },
];
const isUserAdmin = false;
function HomePage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <div>
      <Quote />
      <hr className={classes["interval-line"]} />
      {Dummy_blogs.map((blogs, index) => (
        <PostInfo
          key={index}
          title={blogs.title}
          image={blogs.cover}
          description={blogs.description}
          author={blogs.author}
          date={blogs.date}
          isPined={blogs.isPined}
          isDarkMode={isDarkMode}
          isAdmin={isUserAdmin}
          isOdd={index % 2 ? true : false}
        />
      ))}
    </div>
  );
}

export default HomePage;
