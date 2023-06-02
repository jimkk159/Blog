import { redirect } from "react-router-dom";
import * as authHelper from "../../../utils/auth";
import PostEditor from "../../../components/Post/PostEditor";

function NewPost() {
  return <PostEditor method="post" />;
}

export default NewPost;

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const token = authHelper.getAuthToken();

  const postData = {
    CategoryId: data.get("CategoryId"),
    title: data.get("title"),
    content: data.get("content"),
    tagId: [],
  };

  const url = process.env.REACT_APP_BACKEND_URL + "/api/v1/posts";
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postData),
  });

  const resJSON = await response.json();
  const postId = resJSON.data.id;
  return redirect("/" + postId);
}
