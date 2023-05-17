import { useEffect, useState } from "react";
import HightLight from "./HightLight";
import { Form, useNavigation, useRouteLoaderData } from "react-router-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

function PostForm({ method, post }) {
  const [content, setContent] = useState();

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { categories } = useRouteLoaderData("posts");

  const postContent = post ? post.content : "";
  useEffect(() => {
    setContent(postContent);
  }, [postContent]);

  return (
    <>
      <ReactMarkdown
        components={{
          code: HightLight,
        }}
      >
        {content}
      </ReactMarkdown>
      <Form method={method}>
        <select
          id="CategoryId"
          name="CategoryId"
          defaultValue={post ? post.CategoryId : null}
        >
          {categories &&
            categories.length &&
            categories
              .filter((el) => el.name !== "root")
              .map((el, index) => (
                <option key={index} value={el.id}>
                  {el.name}
                </option>
              ))}
        </select>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={post ? post.title : null}
        />
        <textarea
          name="content"
          autoFocus
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </Form>
    </>
  );
}

export default PostForm;
