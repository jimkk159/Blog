import React from "react";

//Custom Component
import PostInfo from "./PostInfo";

const isUserAdmin = false;
function PostsInfo(props) {
  if (props.isLoading) return <h2>Loading...</h2>;

  return props.posts.map((post, index) => {
    return (
      <PostInfo
        key={index}
        postId={post.id}
        topic={post.topic}
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

export default PostsInfo;
