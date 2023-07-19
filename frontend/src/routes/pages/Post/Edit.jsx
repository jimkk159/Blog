import { redirect, json, useRouteLoaderData } from "react-router-dom";

import store from "../../../store";
import * as authHelper from "../../../utils/auth";
import PostEditor from "../../../components/UI/Editor/Post";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

function EditPost() {
  const { post } = useRouteLoaderData("post-detail");

  return (
    <div className="my-8">
      <AwaitWrapper resolve={post}>
        {(loadPost) => <PostEditor method="patch" post={loadPost} />}
      </AwaitWrapper>
    </div>
  );
}

export default EditPost;

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();
  const token = data.get("token")
    ? data.get("token")
    : authHelper.getAuthToken();
  const tagIds = store?.getState()?.tag?.tags.map((el) => el.id);

  const postData = {
    title: data.get("title"),
    content: data.get("content"),
    summary: data.get("summary"),
    CategoryId: data.get("CategoryId"),
    previewImg: data.get("previewImg"),
    tagIds,
  };

  const postId = params.pid;
  const url = process.env.REACT_APP_BACKEND_URL + "/api/v1/posts/" + postId;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok)
    return json(
      { message: "Something wrong happen when updating post..." },
      { status: 500 }
    );

  return redirect(`/posts/${params.pid}`);
}
