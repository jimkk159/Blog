import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { createEditorStateWithText } from "@draft-js-plugins/editor";

//Redux Slice
import { postActions } from "../../store/post-slice";

//Custom Function
import { choiceLanguage } from "../../blogs/util/choiceLanguage";

//Custom Hook
import useHttp from "./http-hook";

const usePost = () => {
  const { isLoading, error, sendRequest, clearError } = useHttp();

  //Post Title
  const [titleState, setTitleState] = useState(() => EditorState.createEmpty());

  //Post Content
  const [originState, setOriginState] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  //Redux
  const isEnglish = useSelector((state) => state.language.isEnglish);
  const dispatch = useDispatch();

  //GET Post
  const fetchPost = useCallback(
    async (pid) => {
      try {
        const post = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/posts/${pid}`
        );
        const postContent = post?.content;
        let titleText = choiceLanguage(
          isEnglish,
          postContent?.en?.title,
          postContent?.ch?.title,
          ""
        );
        titleText = titleText ? titleText : "";
        let enContent;
        try {
          enContent = JSON.parse(postContent?.en?.content);
        } catch (err) {
          enContent = null;
        }
        let chContent;
        try {
          chContent = JSON.parse(postContent?.ch?.content);
        } catch (err) {
          chContent = null;
        }
        const postJSON = choiceLanguage(
          isEnglish,
          enContent,
          chContent,
          convertToRaw(ContentState.createFromText(""))
        );
        const postContentState = convertFromRaw(postJSON);
        setOriginState(EditorState.createWithContent(postContentState));
        setEditorState(EditorState.createWithContent(postContentState));
        setTitleState(createEditorStateWithText(titleText));
        const responseCover = post.cover;
        const cover = responseCover
          ? responseCover.startsWith("https://") ||
            responseCover.startsWith("http://") ||
            responseCover.startsWith("data:image")
            ? `${responseCover}`
            : `${process.env.REACT_APP_BACKEND_URL}/${responseCover}`
          : null;
        dispatch(
          postActions.setInit({
            id: post.id,
            date: post.date,
            authorId: post.author_id,
            author: post.author,
            avatar: post.avatar,
            topicId: post.topic_id,
            pin: post.pin,
            url: cover,
            related: post.related,
            tags: post.tags,
          })
        );
        return post;
      } catch (err) {}
    },
    [isEnglish, dispatch, sendRequest]
  );

  return {
    fetchPost,
    isLoading,
    error,
    clearError,
    titleState,
    setTitleState,
    originState,
    setOriginState,
    editorState,
    setEditorState,
  };
};

export default usePost;
