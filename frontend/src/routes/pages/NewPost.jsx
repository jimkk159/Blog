import { redirect } from "react-router-dom";
import * as authHelper from "../../util/auth";
import PostForm from "../../components/PostForm";

function NewPost() {
  return <PostForm method="post" />;
}

export default NewPost;

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
