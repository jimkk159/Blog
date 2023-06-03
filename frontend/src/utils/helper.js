import * as authHelper from "../utils/auth";

export const hasPermissionToPost = ({ auth, AuthorId }) => {
  const token = authHelper.getAuthToken();
  return token && (auth.isRoot || AuthorId === auth.id);
};

export const uploadImg = async (img) => {
  const token = authHelper.getAuthToken();

  const imgForm = new FormData();
  imgForm.append("img", img);

  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + `/api/v1/posts/img`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: imgForm,
    }
  ).catch((err) => err);

  const resJSON = await response.json();
  if (!(resJSON && resJSON.data && resJSON.data.img)) return;

  return resJSON.data.img;
};
