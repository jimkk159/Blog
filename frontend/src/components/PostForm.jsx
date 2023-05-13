import { Form, redirect, useNavigation } from "react-router-dom";
import * as authHelper from "../util/auth";

function PostForm({ method, post }) {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method={method} >
      <label htmlFor="categoryId">Category</label>
      <input
        id="categoryId"
        type="text"
        name="categoryId"
        required
        defaultValue={post ? post.CategoryId : null}
      />
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        name="title"
        required
        defaultValue={post ? post.title : null}
      />
      <label htmlFor="content">Content</label>
      <input
        id="content"
        type="text"
        name="content"
        required
        defaultValue={post ? post.content : null}
      />
      <button disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Save"}
      </button>
    </Form>
  );
}

export default PostForm;
