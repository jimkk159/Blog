// components
import NewComment from "./NewComment";
import PostWrapper from "../Wrapper/PostWrapper";
import CommentItem from "../Items/CommentItem";

function Comment({ post }) {
  return (
    <PostWrapper>
      <div className="flex flex-col space-y-4 border border-self-gray p-4">
        <NewComment post={post} />
        {post.Comments.map((el, index) => (
          <CommentItem key={index} comment={el} />
        ))}
      </div>
    </PostWrapper>
  );
}

export default Comment;
