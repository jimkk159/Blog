import React from "react";

//Custom Component
import PostInfo from "./PostInfo";

function PostsInfo({ isLoading, posts, topics, onPin, onDelete }) {
  if (isLoading) return <h2>Loading...</h2>;

  return posts.map((post, index) => {
    const [topic] = topics?.filter((topic) => post.topic === topic.topic);
    return (
      <PostInfo
        key={index}
        topic={topic}
        post={post}
        isOdd={index % 2 ? true : false}
        onPin={onPin}
        onDelete={onDelete}
      />
    );
  });
}

export default PostsInfo;
