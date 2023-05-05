import { AwaitWrapper } from "../helper/Wrapper";
import { Link, useRouteLoaderData } from "react-router-dom";

function Posts() {
  const { posts, tags } = useRouteLoaderData("posts");

  return (
    <AwaitWrapper resolve={posts}>
      {(loadPosts) => (
        <ul>
          {loadPosts.map((post, index) => (
            <li key={index}>
              <Link to={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>
              <p>{post.content}</p>
              <p>
                tags
                {post.Tags.map((tag, index) => (
                  <span key={index}> {tag.name}</span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </AwaitWrapper>
  );
}

export default Posts;
