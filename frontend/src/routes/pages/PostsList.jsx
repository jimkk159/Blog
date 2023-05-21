import { Link } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

function PostList({ posts }) {
  return (
    <ul className="w-5/6">
      {posts &&
        posts.map((post, index) => (
          <li key={index}>
            <Link to={`/${post.id}`}>
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
            <MDEditor.Markdown source={post.content} />
            <p>
              tags
              {post.Tags.filter((tag) => tag.name !== post.Category.name).map(
                (tag, index) => (
                  <Link
                    key={index}
                    to={`/search?mode=tag&type=id&target=${tag.id}`}
                  >
                    {tag.name}
                  </Link>
                )
              )}
            </p>
            <p>
              <Link
                key="category"
                to={`/search?mode=category&type=id&target=${post.Category.id}`}
              >{`${post.Category && post.Category.name}`}</Link>
            </p>
          </li>
        ))}
    </ul>
  );
}

export default PostList;
