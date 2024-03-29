import { useMediaQuery } from "react-responsive";
import { json, defer, redirect, useRouteLoaderData } from "react-router-dom";

// helper
import * as authHelper from "../../../utils/auth";

// components
import Detail from "../../../components/Post/Detail";
import Chapter2 from "../../../components/Post/Catalogue";
import Container from "../../../components/UI/Container";
import Comment from "../../../components/Comment/Index";
import PostsNavigation from "../../../components/Post/Navigation";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

function PostDetail() {
  const { post } = useRouteLoaderData("post-detail");

  // import hooks
  const matches1280 = useMediaQuery({ query: "(max-width: 1280px)" });

  const left = !matches1280 && (
    <div className="flex w-full justify-end pr-2">
      <PostsNavigation limit />
    </div>
  );
  const right = !matches1280 && <Chapter2 post={post} />;

  return (
    <Container left={left} right={right}>
      <AwaitWrapper resolve={post}>
        {(loadPost) => {
          return (
            <>
              <Detail post={loadPost} />
              <div className="my-6 w-full" />
              <Comment post={loadPost} />
            </>
          );
        }}
      </AwaitWrapper>
    </Container>
  );
}

export default PostDetail;

async function postLoader(id) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${id}`
  );

  switch (response.status) {
    case 404:
      throw json({ message: "Could not fetch target post." }, { status: 404 });
    default:
      if (!response.ok)
        throw json({ message: "Unknown Error" }, { status: 500 });
  }

  const resJSON = await response.json();
  return resJSON.data;
}

export function loader({ params }) {
  const id = params.pid;
  return defer({
    post: postLoader(id),
  });
}

export async function action({ params, request }) {
  const postId = params.pid;
  const token = authHelper.getAuthToken();

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/${postId}`,
    {
      method: request.method,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok)
    return json(
      {
        message: `Something wrong happen when ${
          request.method === "DELETE" ? "deleting" : "creating"
        } post...`,
      },
      { status: 500 }
    );

  if (request.method === "DELETE") return redirect(`/`);
  return redirect(`/${postId}`);
}
