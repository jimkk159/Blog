import React from "react";
import { useSelector } from "react-redux";

//Image
import quoteImage from "../../assets/img/Einstein-quote.png";
import coverImage1 from "../../assets/img/cover/1.webp";
import coverImage2 from "../../assets/img/cover/2.webp";

//Custom Component
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
  },
  {
    title: "Test title 2",
    cover: coverImage2,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date("2010-10-05").toLocaleDateString("en-US", options),
    author: "Bob",
    tag: "Book",
  },
];

function HomePage() {
  const isDarkMode = useSelector((state) => state.theme.value);
  return (
    <div className="black-background">
      <div className={classes["quote-container"]}>
        <img
          src={quoteImage}
          alt="great man quote"
          className={classes["title-img"]}
        />
        <h1>
          If you can't explain it simply, you don't understand it well enough.{" "}
          <br />
          <br />
          —— Albert Einstein
        </h1>
      </div>
      <hr className={classes["interval-line"]} />
      {Dummy_blogs.map((blogs, index) => (
        <PostInfo
          key={index}
          title={blogs.title}
          image={blogs.cover}
          description={blogs.description}
          author={blogs.author}
          date={blogs.date}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}

export default HomePage;
