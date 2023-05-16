import { Link } from "react-router-dom";
import { AwaitWrapper } from "../helper/Wrapper";

function PostList({ posts }) {
  return (
    <AwaitWrapper resolve={posts}>
      {(loadPosts) => (
        <ul>
          {loadPosts.map((post, index) => (
            <li key={index}>
              <Link to={`/posts/${post.id}`}>
                <h2>{`${post.title}`}</h2>
              </Link>
              <p>
                created by
                {post.Author && (
                  <Link to={`/profile/${post.Author.id}`}>
                    {`${post.Author.name}`}
                  </Link>
                )}
              </p>
              <p>{post.content}</p>
              <p>
                tags
                {post.Tags.filter((tag) => tag.name !== post.Category.name).map(
                  (tag, index) => (
                    <Link
                      key={index}
                      to={`/posts/search?mode=tag&type=id&target=${tag.id}`}
                    >
                      {tag.name}
                    </Link>
                  )
                )}
              </p>
              <p>
                <Link
                  key="category"
                  to={`/posts/search?mode=category&type=id&target=${post.Category.id}`}
                >{`${post.Category && post.Category.name}`}</Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </AwaitWrapper>
  );
}

export default PostList;
