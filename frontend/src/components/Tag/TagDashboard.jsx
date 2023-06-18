import { useRef, useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";

// redux
import { tagActions } from "../../store/tag-slice";

// helper
import * as authHelper from "../../utils/auth";

function TagDashBoard({ tags, current, isTouched }) {
  const inputRef = useRef(null);
  const [searchTag, setSearchTag] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // redux
  const dispatch = useDispatch();
  const current = useSelector((state) => state.tag.tags);

  const choices =
    current &&
    tags
      .filter(
        (tag) => tag && !current.includes(tag.name && tag.name.toLowerCase())
      )
      .filter(
        (tag) =>
          tag &&
          tag.name &&
          (tag.name.startsWith(searchTag) || tag.name.endsWith(searchTag))
      );
      
  // custom functions
  const inputChangeHandler = (e) => {
    setIsTouched(true);
    setSearchTag(e.target.value);
  };

  const keyDownHandler = async (e) => {
    if (e.key === "Enter") {
      const token = authHelper.getAuthToken();
      const name = e.target.value;
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/api/v1/tags",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ name }),
        }
      ).catch((err) => {
        setSubmigErrorMessage("create tag fail");
      });
      response = await response.json();
      const tag = response.data;
      tags.push(tag);
      dispatch(tagActions.add({ tag }));
      setSearchTag("");
      setIsEdit(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className="m-0 w-full border-none pl-1 text-[14px] outline-none"
        placeholder={"Search/Create..."}
        value={searchTag}
        onChange={inputChangeHandler}
        onKeyDown={keyDownHandler}
      />
      <hr className="mb-0 mt-0 w-full border-l-0 border-r-0" />
      {!isTouched && submigErrorMessage && (
        <p className="mx-0.5 mb-0 mt-0.5 text-left text-sm text-self-red">
          {submigErrorMessage}
        </p>
      )}
      <div className={"h-full w-full"}>
        {choices.map((el, index) => (
          <p
            key={index}
            className="m-0.5 inline-block min-w-[20px] cursor-pointer items-center rounded-2xl bg-gray-600 px-2 text-[4px] text-gray-50 hover:bg-gray-700"
            onClick={() => dispatch(tagActions.add({ tag: el }))}
          >
            {el.name}
          </p>
        ))}
      </div>
    </>
  );
}

export default TagDashBoard;
