import React from "react";

//Custom Component
import Post from "./Post";

const isUserAdmin = false;
function Posts(props) {
  if (props.isLoading) return <h2>Loading...</h2>;
  return props.posts.map((post, index) => (
    <Post
      key={index}
      title={post.title}
      date={post.date}
      author={post.author}
      image={post.cover}
      description={post.description}
      tags={post.tags}
      isPined={post.isPined}
      isAdmin={isUserAdmin}
      isOdd={index % 2 ? true : false}
    />
  ));
}

export default Posts;
