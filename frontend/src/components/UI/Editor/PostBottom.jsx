import { useNavigation } from "react-router-dom";

// components
import Button from "../../UI/Button";

function PostEditorBottom({
  onNext,
  onCancel,
  children,
  isTouched,
  submigErrorMessage,
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="my-8 rounded px-4 md:mt-16 md:p-0">
      <div className="flex flex-wrap items-center justify-start">
        <p className="mr-4 text-base font-bold capitalize text-self-pink-500 md:mr-6 md:text-2xl">
          <span className="text-white underline">Which topic</span>
          {" does it belong to?"}
        </p>
        <div className="mt-2 w-40 md:w-60">{children}</div>
      </div>
      <div className="mt-8 flex flex-col ">
        {!isTouched && submigErrorMessage && (
          <p className="px-1 pb-2 text-left font-pt-serif text-sm text-self-red">
            {submigErrorMessage}
          </p>
        )}
        <div className="flex justify-end font-pt-serif ">
          <Button
            type="button"
            disabled={isSubmitting}
            loading={isSubmitting}
            className={
              "ml-4 rounded-xl border-2 border-blue-500 bg-transparent px-4 py-1.5 text-blue-500 shadow-xl " +
              "hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            }
            spinner={{ color: "text-blue-600" }}
            onClick={onNext}
          >
            Next
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="ml-4 rounded-xl bg-blue-500 px-4 py-1.5 text-white shadow-xl hover:bg-blue-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PostEditorBottom;
