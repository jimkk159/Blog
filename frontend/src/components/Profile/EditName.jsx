import { BarLoader } from "react-spinners";
import { useState, useEffect, useCallback } from "react";

// icons
import { BiEdit } from "react-icons/bi";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// helper
import * as authHelper from "../../utils/auth";

function EditProfileName({ defaultValue, isEdit }) {
  const token = authHelper.getAuthToken();

  const [name, setName] = useState("");
  const [isEditName, setIsEditName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateNameHandler = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEdit) return;
      setIsLoading(true);
      if (!!name) {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + `/api/v1/users/me`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              name,
            }),
          }
        ).catch((err) => err);
        if (response.ok) setIsLoading(false);
      }
      setIsEditName(false);
    },
    [token, name, isEdit]
  );

  useEffect(() => {
    if (!!defaultValue) {
      setName(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="flex items-center justify-center space-x-2">
      {!isEditName && (
        <>
          <h1 className="-mt-2 flex truncate bg-transparent font-kanit text-2xl font-bold">
            {name}
          </h1>
          {isEdit && (
            <BiEdit className="h-4 w-4" onClick={() => setIsEditName(true)} />
          )}
        </>
      )}
      {isEdit && isEditName && (
        <>
          {!isLoading && (
            <div className="flex w-full items-center justify-center space-x-3">
              <input
                className="-mt-2 flex w-52 border-b border-self-gray bg-transparent font-kanit text-2xl font-bold outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex items-center justify-center space-x-2">
                <AiOutlineCloseCircle
                  className="h-6 w-6 text-red-300"
                  onClick={() => {
                    setIsEditName(false);
                    setName(defaultValue);
                  }}
                />
                <AiOutlineCheckCircle
                  className="h-6 w-6 text-green-300"
                  onClick={updateNameHandler}
                />
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex h-8 w-full items-center justify-center">
              <BarLoader color="#60a5fa" width={80} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EditProfileName;
