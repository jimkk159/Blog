import { useState, useCallback } from "react";

// components
import Button from "../UI/Button";

// helper
import * as authHelper from "../../utils/auth";

function EditProfilePassword({ onCancel, onConfirm = () => {}, isEdit }) {
  const token = authHelper.getAuthToken();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setNewConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updatePasswordHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      setIsLoading(true);
      if (!!password && !!newPassword && !!confirmNewPassword) {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/auth/updatePassword`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              password,
              newPassword,
              confirmNewPassword,
            }),
          }
        ).catch((err) => err);
        if (response.ok) setIsLoading(false);
        setPassword("");
        setNewPassword("");
        setNewConfirmPassword("");
      }
      onConfirm();
    },
    [token, password, newPassword, confirmNewPassword, onConfirm]
  );
  if (!isEdit) return;
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4 bg-slate-600">
        <div className="flex w-full flex-col items-center justify-center space-y-4 p-4">
          <div className="flex flex-col space-y-0.5">
            <label htmlFor="password">Old password</label>
            <input
              type="password"
              name="password"
              className="h-8 w-40 rounded pl-2 text-black outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-0.5">
            <label htmlFor="newPassword">Password</label>
            <input
              type="password"
              name="newPassword"
              className="h-8 w-40 rounded pl-2 text-black outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-0.5">
            <label htmlFor="confirmNewPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              className="h-8 w-40 rounded pl-2 text-black outline-none"
              value={confirmNewPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-full">
          <Button
            type="button"
            className="box-border w-1/2 rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300"
            disabled={isLoading}
            loading={isLoading}
            onClick={updatePasswordHandler}
          >
            {!isLoading && "Confirm"}
          </Button>
          <Button
            type="button"
            className="box-border w-1/2 rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePassword;
