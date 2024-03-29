import { useRef, useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { m, LazyMotion, AnimatePresence, domAnimation } from "framer-motion";

// redux
import { tagActions } from "../../store/tag-slice";

// components
import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

// helper
import * as authHelper from "../../utils/auth";

function TagsToolTip({
  postTags,
  category,
  isNew = false,
  isEdit,
  onClose,
  onToggle,
}) {
  const inputRef = useRef(null);
  const [searchTag, setSearchTag] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // redux
  const dispatch = useDispatch();
  const current = useSelector((state) => state.tag.tags);
  const currentName =
    current &&
    (isNew
      ? [...current.map((el) => el && el.name && el.name.toLowerCase())]
      : [
          ...current.map((el) => el && el.name && el.name.toLowerCase()),
          category.name,
        ]);

  // react-router
  const { relation } = useRouteLoaderData("relation");

  // custom functions
  const inputChangeHandler = (e) => {
    setIsTouched(true);
    setSearchTag(e.target.value);
  };

  // useEffect
  useEffect(() => {
    if (!isNew) dispatch(tagActions.update({ tags: postTags }));
    return () => dispatch(tagActions.init());
  }, [dispatch, isNew, postTags]);

  return (
    <div
      className="relative flex"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <p className="m-0.5 flex w-[30px] cursor-pointer items-center justify-center rounded-2xl bg-gray-600 px-2 text-[4px] text-base text-gray-50 outline-none">
        +
      </p>
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {isEdit && (
            <m.div
              transition={{ ease: "easeIn", duration: 0.5 }}
              initial={{ width: 0, height: 0 }}
              animate={{ width: 200, height: 150 }}
              exit={{ width: 0, height: 0 }}
              className="absolute bottom-8 z-10 overflow-hidden rounded-sm border-2 border-gray-200 bg-white p-1.5 shadow ring-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full px-1 py-0.5">
                <AwaitWrapper resolve={relation}>
                  {(response) => {
                    const tags = response?.data?.tags?.data ?? [];
                    const choices =
                      currentName &&
                      tags
                        .filter(
                          (tag) =>
                            tag &&
                            !currentName.includes(
                              tag.name && tag.name.toLowerCase()
                            )
                        )
                        .filter(
                          (tag) =>
                            tag &&
                            tag.name &&
                            (tag.name.startsWith(searchTag) ||
                              tag.name.endsWith(searchTag))
                        );

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
                        onClose();
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
                              onClick={() =>
                                dispatch(tagActions.add({ tag: el }))
                              }
                            >
                              {el.name}
                            </p>
                          ))}
                        </div>
                      </>
                    );
                  }}
                </AwaitWrapper>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
      ,
    </div>
  );
}

export default TagsToolTip;
