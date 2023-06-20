import { redirect } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import store from "../../../store";
import * as authHelper from "../../../utils/auth";
import Container from "../../../components/UI/Container";
import PostEditor from "../../../components/Post/PostEditor";
import PostsNavigation2 from "../../../components/Post/PostsNavigation2";

function NewPost() {
  // import hooks
  const matches1280 = useMediaQuery({ query: "(max-width: 1280px)" });

  const left = !matches1280 && (
    <div className="flex w-full justify-end pr-2">
      <PostsNavigation2 limit />
    </div>
  );

  return (
    <Container left={left}>
      <PostEditor method="post" />
    </Container>
  );
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
