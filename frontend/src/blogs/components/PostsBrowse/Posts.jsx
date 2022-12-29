import React from "react";
import { useSelector } from "react-redux";

//Custom Component
import Post from "./Post";

const isUserAdmin = false;
function Posts(props) {
  const isEnglish = useSelector((state) => state.language.isEnglish);
  if (props.isLoading) return <h2>Loading...</h2>;

  return props.posts.map((post, index) => {
    return (
      <Post
        key={index}
        title={isEnglish ? post.language.en.title : post.language.ch.title}
        date={post.date}
        author={post.author}
        image={post.cover.img}
        short={isEnglish ? post.language.en.short : post.language.ch.short}
        tags={post.tags}
        isPined={post.isPined}
        isAdmin={isUserAdmin}
        isOdd={index % 2 ? true : false}
      />
    );
  });
}

export default Posts;
