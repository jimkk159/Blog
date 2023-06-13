import { useRef } from "react";
import { Form, useSubmit } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar() {
  const formRef = useRef();

  // react-router
  const submit = useSubmit("/posts/search");
  const searchHandler = () =>
    submit(
      {
        mode: formRef.current.mode.value,
        target: formRef.current.target.value,
      },
      { method: "post", action: "/posts/search" }
    );

  return (
    <Form
      ref={formRef}
      method="post"
      action="/posts/search"
      className="flex flex-row self-center md:mr-4 lg:mr-8"
    >
      <div className="relative">
        <AiOutlineSearch
          className="absolute right-1 top-2 text-black"
          onClick={searchHandler}
        />
        <input
          id="target"
          name="target"
          type="text"
          className="rounded-l-3xl text-gray-800 outline-none md:w-32 md:py-1 md:pl-4 md:text-sm lg:w-40 lg:py-0.5 lg:pl-3 lg:text-base"
          placeholder="Search..."
        />
      </div>
      <select
        id="mode"
        name="mode"
        className="appearance-none rounded-r-3xl border-l border-gray-300 text-gray-800 outline-none md:py-0 md:pl-1.5 md:pr-0.5 md:text-sm lg:px-1 lg:py-0.5 lg:text-base"
      >
        <option value="category">Topic</option>
        <option value="title">Title</option>
        <option value="tag">Tag</option>
        <option value="author">Author</option>
      </select>
    </Form>
  );
}

export default SearchBar;
