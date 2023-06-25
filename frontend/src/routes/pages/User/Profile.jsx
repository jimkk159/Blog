import { useState } from "react";
import {
  defer,
  redirect,
  useParams,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";

// redux
import store from "../../../store";

// icons
import { BsFillKeyFill } from "react-icons/bs";

// components
import PostList3 from "../../../components/Post/List3";
import Container from "../../../components/UI/Container";
import PinkButton from "../../../components/UI/PinkButton";
import SectionTitle from "../../../components/Section/SectionTitle";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";
import EditProfileName from "../../../components/Profile/EditName";
import EditProfileAvatar from "../../../components/Profile/EditAvatar";
import EditProfilePassword from "../../../components/Profile/EditPassword";
import EditProfileDescription from "../../../components/Profile/EditDescription";

// helper
import * as authHelper from "../../../utils/auth";

function Profile() {
  const [page, setPage] = useState(1);
  const [isUpdatePassword, setIsUpdatePassword] = useState();

  // react-router
  const { id } = useParams();
  const { author, posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  // custom functions
  const limit = searchParams.get("limit") ?? 5;
  const navPageHandler = (nextPage) => {
    setSearchParams({ page: nextPage, limit });
    setPage(nextPage);
  };

  return (
    <Container>
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full items-center justify-center rounded-xl bg-self-dark-gray p-6 lg:max-w-3xl">
          <div className="flex h-full w-full flex-col rounded-xl bg-self-dark p-8 text-white lg:w-[640px] ">
            <div className="flex w-full items-center justify-center rounded-2xl py-4">
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <EditProfileAvatar
                    isEdit={!id}
                    defaultValue={response?.data?.avatar}
                  />
                )}
              </AwaitWrapper>
            </div>
            <div
              className={`flex w-full items-center space-x-4 ${
                !id ? "justify-start" : "justify-center"
              }`}
            >
              {!id && <div className="h-8 w-[calc(50%-90px)]" />}
              <AwaitWrapper resolve={author}>
                {(response) => (
                  <>
                    <EditProfileName
                      isEdit={!id}
                      defaultValue={response.data.name}
                    />
                    {!id && (
                      <PinkButton
                        className="px-4 py-2"
                        onClick={() => setIsUpdatePassword((prev) => !prev)}
                      >
                        <div className="flex items-center justify-center space-x-0.5">
                          <BsFillKeyFill className="h-[20px] w-[20px]" />
                          <p className="text-xs">Password</p>
                        </div>
                      </PinkButton>
                    )}
                  </>
                )}
              </AwaitWrapper>
            </div>
            {!id && isUpdatePassword && (
              <div className="mt-2">
                <EditProfilePassword
                  isEdit={!id}
                  onCancel={() => setIsUpdatePassword(false)}
                  onConfirm={() => setIsUpdatePassword(false)}
                />
              </div>
            )}
            {!isUpdatePassword && (
              <>
                <div className="mb-4 mt-4 flex h-40 flex-col items-center justify-center space-y-2 border border-self-gray bg-yellow-700 bg-opacity-20 p-2">
                  <AwaitWrapper resolve={author}>
                    {(response) => (
                      <EditProfileDescription
                        isEdit={!id}
                        defaultValue={response?.data?.description}
                      />
                    )}
                  </AwaitWrapper>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <SectionTitle first={"My Posts"} second={"Library"} />
                </div>
                <AwaitWrapper resolve={posts}>
                  {(response) => (
                    <PostList3
                      size="small"
                      limit={5}
                      page={page}
                      posts={response.data ?? []}
                      total={response?.total}
                      onNavPage={navPageHandler}
                    />
                  )}
                </AwaitWrapper>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Profile;

async function myAuthorLoader(token) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok) throw new Error();

  return response.json();
}

async function myPostsLoader({ token, page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/me?fields=editedAt,-content,-AuthorId,-CategoryId,-thumbs,-views&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (!response.ok)
    return {
      data: [],
      total: 0,
    };

  return response.json();
}

async function authorLoader(userId) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/users/${userId}`
  );
  if (!response.ok) throw new Error();

  return response.json();
}

async function postsLoader({ userId, page, limit }) {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL +
      `/api/v1/posts/search?mode=author&type=id&target=${userId}&?fields=editedAt,-content,-AuthorId,-CategoryId,-thumbs,-views&page=${page}&limit=${limit}`
  );
  if (!response.ok)
    return {
      data: [],
      total: 0,
    };

  return response.json();
}

export async function loader({ request, params }) {
  const token = authHelper.getAuthToken();

  const searchParams = new URL(request.url).searchParams;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 5;

  if (!params.id)
    return defer({
      author: myAuthorLoader(token),
      posts: myPostsLoader({ token, page, limit }),
    });

  const state = store.getState();
  if (state?.auth?.id + "" === params.id) return redirect("/profile");

  return defer({
    author: authorLoader(params.id),
    posts: postsLoader({ userId: params.id, page, limit }),
  });
}
