import React from "react";

//Custom Component
import PostInfo from "./PostInfo";

function PostsInfo(props) {
  if (props.isLoading) return <h2>Loading...</h2>;

  return props.posts.map((post, index) => {
    return (
      <PostInfo
        key={index}
        post={post}
        isOdd={index % 2 ? true : false}
        onDelete={props.onDelete}
      />
    );
  });
}

export default PostsInfo;
