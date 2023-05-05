import { Form, redirect, useNavigation } from "react-router-dom";
import * as authHelper from "../util/auth";

function PostForm({ method, post }) {
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method={method}>
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

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();
  const token = authHelper.getAuthToken();

  const postData = {
    categoryId: data.get("categoryId"),
    title: data.get("title"),
    content: data.get("content"),
    tagId: [],
  };

  let url;
  switch (method) {
    case "POST":
      url = process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/posts";
      break;
    case "PATCH":
      const postId = params.pid;
      url = process.env.REACT_APP_BACKEND_URL + "/api/v1/blog/posts/" + postId;
      break;
    default:
      break;
  }

  await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postData),
  });
  return redirect("/posts");
}
