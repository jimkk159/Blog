import { useState } from "react";
import { defer, redirect, useLoaderData } from "react-router-dom";

// redux
import store from "../../../store";

// components
import Container from "../../../components/UI/Container";
import PostList3 from "../../../components/Post/PostsList3";
import SectionTitle from "../../../components/Section/SectionTitle";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";
import EditProfileName from "../../../components/Profile/EditProfileName";
import EditProfileAvatar from "../../../components/Profile/EditProfileAvatar";
import EditProfileDescription from "../../../components/Profile/EditProfileDescription";

function BrowserProfile() {
  const [page, setPage] = useState(1);

  // react-router
  const { author, posts } = useLoaderData();

  const navPageHandler = (nextPage) => setPage(nextPage);

  return (
    <Container>
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full items-center justify-center rounded-xl bg-self-dark-gray p-6 lg:max-w-3xl">
          <div className="flex h-full w-full flex-col rounded-xl bg-self-dark p-8 text-white lg:w-[640px] ">
            <div className="flex w-full items-center justify-center rounded-2xl py-4">
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <EditProfileAvatar defaultValue={response?.data?.avatar} />
                )}
              </AwaitWrapper>
            </div>
            <div className="flex w-full items-center justify-start space-x-4">
              <div className="h-8 w-[calc(50%-90px)]" />
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <EditProfileName defaultValue={response.data.name} />
                )}
              </AwaitWrapper>
            </div>
            <div className="mb-4 mt-4 flex h-40 flex-col items-center justify-center space-y-2 border border-self-gray bg-yellow-700 bg-opacity-20 p-2">
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <EditProfileDescription
                    defaultValue={response?.data?.description}
                  />
                )}
              </AwaitWrapper>
            </div>
            <div className="flex items-center justify-between px-4 pt-4">
              <SectionTitle first={"Posts"} second={"Library"} />
            </div>
            <AwaitWrapper resolve={posts}>
              {(response) => (
                <PostList3
                  size="small"
                  page={page}
                  posts={response.data ?? []}
                  total={response?.total}
                  onNavPage={navPageHandler}
                />
              )}
            </AwaitWrapper>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default BrowserProfile;

async function authorLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/${uid}`
  );
  if (!response.ok) throw new Error();

  return response.json();
}

async function postsLoader(uid) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=author&type=id&target=${uid}`
  );
  if (!response.ok)
    return {
      data: [],
      total: 0,
    };

  return response.json();
}

export async function loader({ params }) {
  const state = store.getState();
  if (state?.auth?.id + "" === params.id) return redirect("/profile");

  return defer({
    author: authorLoader(params.id),
    posts: postsLoader(params.id),
  });
}
