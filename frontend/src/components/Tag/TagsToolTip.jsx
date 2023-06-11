import { useRef, useState, useEffect } from "react";
import { tagActions } from "../../store/tag-slice";
import { useRouteLoaderData } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import * as authHelper from "../../utils/auth";

function TagsToolTip({ postTags, category, isNew = false }) {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const { tags } = useRouteLoaderData("relation");
  const [searchTag, setSearchTag] = useState("");
  const current = useSelector((state) => state.tag.tags);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  const currentName =
    current &&
    (isNew
      ? [...current.map((el) => el && el.name && el.name.toLowerCase())]
      : [
          ...current.map((el) => el && el.name && el.name.toLowerCase()),
          category.name,
        ]);

  const choices =
    currentName &&
    tags
      .filter(
        (tag) =>
          tag && !currentName.includes(tag.name && tag.name.toLowerCase())
      )
      .filter(
        (tag) =>
          tag &&
          tag.name &&
          (tag.name.startsWith(searchTag) || tag.name.endsWith(searchTag))
      );

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

  useEffect(() => {
    if (!isNew) dispatch(tagActions.update({ tags: postTags }));
    return () => dispatch(tagActions.init());
  }, [dispatch, isNew, postTags]);

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
        setIsEdit((prev) => !prev);
      }}
    >
      <p className="m-0.5 flex w-[30px] items-center justify-center rounded-2xl bg-gray-600 px-2 text-[4px] text-base text-gray-50 outline-none">
        +
      </p>
      {
        <CSSTransition
          in={isEdit}
          timeout={500}
          className="absolute bottom-8 z-10 overflow-hidden rounded-sm border-gray-200 bg-white p-1.5 shadow ring-1"
          classNames={{
            enter: "w-[0px] h-[0px] p-[0px]",
            enterActive:
              "w-[200px] h-[150px] border-2 transition-all duration-500",
            enterDone: "w-[200px] h-[150px] border-2",
            exit: "w-[200px] h-[150px] border-2",
            exitActive: "w-[0px] h-[0px] p-[0px] transition-all duration-500",
            exitDone: "w-[0px] h-[0px]",
          }}
          mountOnEnter
          unmountOnExit
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative h-full w-full px-1 py-0.5">
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
              <p className="mx-0.5 mb-0 mt-0.5 text-left text-sm text-[#FF0000]">
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
          </div>
        </CSSTransition>
      }
    </div>
  );
}

export default TagsToolTip;
