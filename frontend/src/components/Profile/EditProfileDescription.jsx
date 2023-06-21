import { BarLoader } from "react-spinners";
import { useState, useEffect, useCallback } from "react";

// icons
import { BiEdit } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// helper
import * as authHelper from "../../utils/auth";

function EditProfileDescription({ defaultValue, isEdit }) {
  const token = authHelper.getAuthToken();

  const [description, setDescription] = useState("");
  const [isEditDescription, setIsEditDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateIntroductionHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEdit) return;
      setIsLoading(true);
      if (!!description) {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              description,
            }),
          }
        ).catch((err) => err);
        if (response.ok) setIsLoading(false);
      }
      setIsEditDescription(false);
    },
    [token, description, isEdit]
  );

  useEffect(() => {
    if (!!defaultValue) setDescription(defaultValue);
  }, [defaultValue]);

  return (
    <>
      {!isEditDescription && (
        <>
          {isEdit && (
            <BiEdit
              className="h-8 w-8"
              onClick={() => setIsEditDescription(true)}
            />
          )}
          <p className="h-full w-full overflow-auto rounded-lg text-justify font-kanit text-sm text-white outline-none">
            {description}
          </p>
        </>
      )}
      {isEdit && isEditDescription && (
        <>
          {!isLoading && (
            <div className="flex space-x-2">
              <AiOutlineCloseCircle
                className="h-8 w-8 text-red-300"
                onClick={() => {
                  setIsEditDescription(false);
                  setDescription(defaultValue);
                }}
              />
              <AiOutlineCheckCircle
                className="h-8 w-8 text-green-300"
                onClick={updateIntroductionHandler}
              />
            </div>
          )}
          {isLoading && (
            <div className="flex h-8 w-full items-center justify-center">
              <BarLoader color="#60a5fa" width={80} />
            </div>
          )}
          <textarea
            className="h-full w-full resize-none rounded-sm pl-1 font-kanit text-sm text-black outline-none placeholder:pl-1"
            value={description}
            placeholder="Write your introduction here..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </>
      )}
    </>
  );
}

export default EditProfileDescription;
