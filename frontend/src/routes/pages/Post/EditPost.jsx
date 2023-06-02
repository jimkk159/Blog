import store from "../../../store";
import * as authHelper from "../../../utils/auth";
import { AwaitWrapper } from "../../helper/Wrapper";
import PostEditor from "../../../components/Post/PostEditor";
import { redirect, useRouteLoaderData } from "react-router-dom";

function EditPost() {
  const { post } = useRouteLoaderData("post-detail");

  return (
    <AwaitWrapper resolve={post}>
      {(loadPost) => <PostEditor method="patch" post={loadPost} />}
    </AwaitWrapper>
  );
}

export default EditPost;

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();
  const token = authHelper.getAuthToken();
  const tagId = store?.getState()?.tag?.tags.map((el) => el.id);

  const postData = {
    CategoryId: data.get("CategoryId"),
    title: data.get("title"),
    content: data.get("content"),
    tagId,
  };

  const postId = params.pid;
  const url =
    process.env.REACT_APP_BACKEND_URL + "/api/v1/posts/" + postId;

  await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(postData),
  });

  return redirect(`/${params.pid}`);
}
