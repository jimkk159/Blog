import { redirect } from "react-router-dom";

import store from "../../../store";
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
  const tagIds = store?.getState()?.tag?.tags.map((el) => el.id);

  const postData = {
    title: data.get("title"),
    content: data.get("content"),
    summary: data.get("summary"),
    CategoryId: data.get("CategoryId"),
    previewImg: data.get("previewImg"),
    tagIds,
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
  return redirect("/posts/" + postId);
}
