import { useRef } from "react";
import { Form, useSubmit } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar2() {
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
      className="flex flex-row self-center md:mr-4 lg:ml-8 "
    >
      <div className="relative">
        <AiOutlineSearch
          className="absolute left-4 top-2.5"
          onClick={searchHandler}
        />
        <input
          id="target"
          name="target"
          type="text"
          className="rounded-l-3xl bg-self-dark-gray outline-none placeholder:text-self-gray md:w-40 md:py-2 md:pl-10 md:text-sm lg:w-48"
          placeholder="Search..."
        />
      </div>
      <select
        id="mode"
        name="mode"
        className="appearance-none rounded-r-3xl border-l border-gray-600 bg-self-dark-gray outline-none md:py-0 md:pl-1.5 md:pr-0.5 md:text-sm"
      >
        <option value="category">Topic</option>
        <option value="title">Title</option>
        <option value="tag">Tag</option>
        <option value="author">Author</option>
      </select>
    </Form>
  );
}

export default SearchBar2;
