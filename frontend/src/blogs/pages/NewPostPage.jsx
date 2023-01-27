import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";

//Custom Component
import RichTextEditor from "../../shared/components/TextEditor/RichTextEditor";

function NewPostPage() {
  const {
    newPostState: [newPostEditorState, setNewPostEditorState],
  } = useOutletContext();

  //Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  //React Router
  const navigate = useNavigate();

  //Create a Post need to Login
  useEffect(() => {
    if (!isLoggedIn) navigate(`/`);
  }, [isLoggedIn, navigate]);

  return (
    <RichTextEditor
      editorState={newPostEditorState}
      onChange={setNewPostEditorState}
      isNew
    />
  );
}

export default NewPostPage;
