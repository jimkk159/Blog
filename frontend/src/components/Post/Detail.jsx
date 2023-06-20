import { useSelector } from "react-redux";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import {
  useSubmit,
  useNavigate,
  useActionData,
  useNavigation,
} from "react-router-dom";

// helper
import * as helper from "../../utils/helper";

// components
import Button from "../../components/UI/Button";
import TagList from "../../components/Tag/TagList";
import PostWrapper from "../../components/Wrapper/PostWrapper";

function Detail({ post }) {
  const [submigErrorMessage, setSubmigErrorMessage] = useState("");

  // react-router
  const data = useActionData;
  const submit = useSubmit();
  const navigate = useNavigate();

  // redux
  const auth = useSelector((state) => state.auth);
  const startDeleteHandler = () => {
    const proceed = window.confirm("Are you sure?");
    if (proceed) submit(null, { method: "delete" });
  };

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const bottom = (
    <div className="mt-2 flex flex-col">
      {submigErrorMessage && (
        <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
          {submigErrorMessage}
        </p>
      )}
      <div className="flex justify-end font-pt-serif ">
        {helper.hasPermissionToPost({
          auth,
          AuthorId: post.AuthorId,
        }) && (
          <button
            type="submit"
            className="ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            onClick={() => navigate("edit")}
          >
            EDIT
          </button>
        )}
        {helper.hasPermissionToPost({
          auth,
          AuthorId: post.AuthorId,
        }) && (
          <Button
            type="button"
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={startDeleteHandler}
            className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
          >
            DELETE
          </Button>
        )}
      </div>
    </div>
  );

  // useEffect
  useEffect(() => {
    if (data && data.message) {
      setSubmigErrorMessage(data.message);
    }
  }, [data]);

  return (
    <PostWrapper bottom={bottom}>
      <div className="flex h-full min-h-screen flex-col justify-between rounded bg-white p-4 pt-8 md:p-8">
        <div>
          <div className="pb-2">
            <h1
              className={`w-full overflow-y-hidden border-b-2 border-gray-300 pl-1 font-pt-serif text-3xl outline-none`}
            >
              {post.title}
            </h1>
          </div>
          <div className="h-full rounded">
            <MDEditor.Markdown source={post.content} />
          </div>
        </div>
        <div className="mt-4">
          <TagList post={post} />
        </div>
      </div>
    </PostWrapper>
  );
}

export default Detail;
