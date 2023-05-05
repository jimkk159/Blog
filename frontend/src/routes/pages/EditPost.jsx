import { useRouteLoaderData } from "react-router-dom";
import PostForm from "../../components/PostForm";
import { AwaitWrapper } from "../helper/Wrapper";

function EditPost() {
  const { post } = useRouteLoaderData("post-detail");

  return (
    <AwaitWrapper resolve={post}>
      {(loadPost) => <PostForm method="patch" post={loadPost.data} />}
    </AwaitWrapper>
  );
}

export default EditPost;
