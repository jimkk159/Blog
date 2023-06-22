import { useDispatch } from "react-redux";
import { useRef, useCallback } from "react";

// icons
import { AiFillCamera } from "react-icons/ai";

// components
import Avatar2 from "../UI/Avatar2";

// helper
import * as authHelper from "../../utils/auth";

// actions
import { authActions } from "../../store/auth-slice";

function EditProfileAvatar({ defaultValue, isEdit }) {
  const token = authHelper.getAuthToken();

  const inputRef = useRef(null);

  // redux
  const dispatch = useDispatch();

  // custom components
  const inputAvatarHandler = useCallback(() => inputRef.current.click(), []);
  const updateAvatarHander = useCallback(
    async (event) => {
      if (!isEdit) return;
      if (event.target.files && event.target.files.length === 1) {
        const avatar = event.target.files[0];

        const avatarForm = new FormData();
        avatarForm.append("avatar", avatar);

        const resoponse = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/api/v1/users/avatar",
          {
            method: "PATCH",
            headers: { Authorization: "Bearer " + token },
            body: avatarForm,
          }
        ).catch((err) => err);

        const currentAvatar = (await resoponse.json()).data.avatar;

        dispatch(authActions.updateAvatar({ avatar: currentAvatar }));

        window.location.reload();
      }
    },
    [dispatch, token, isEdit]
  );

  return (
    <>
      <Avatar2
        avatar={defaultValue}
        className="m-auto h-60 w-60 border-2 border-white"
      >
        {isEdit && (
          <AiFillCamera
            className="absolute bottom-3 right-3 z-10 h-8 w-8 cursor-pointer bg-transparent text-gray-200 text-opacity-80"
            onClick={inputAvatarHandler}
          />
        )}
      </Avatar2>
      {isEdit && (
        <input
          ref={inputRef}
          style={{ display: "none" }}
          type="file"
          accept=".jpg,.png,.jpeg,.jfif,.gif"
          name="avatar"
          onChange={updateAvatarHander}
        />
      )}
    </>
  );
}

export default EditProfileAvatar;
