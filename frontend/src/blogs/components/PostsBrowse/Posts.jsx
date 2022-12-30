import React from "react";

//Custom Component
import Post from "./Post";

const isUserAdmin = false;
function Posts(props) {
  if (props.isLoading) return <h2>Loading...</h2>;

  return props.posts.map((post, index) => {
    return (
      <Post
        key={index}
        postId={post.id}
        date={post.date}
        author={post.author}
        cover={post.cover}
        language={post.language}
        tags={post.tags}
        isPined={post.isPined}
        isAdmin={isUserAdmin}
        isOdd={index % 2 ? true : false}
      />
    );
  });
}

export default Posts;
