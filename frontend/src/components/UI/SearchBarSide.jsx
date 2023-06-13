import { useRef } from "react";
import { Form, useSubmit } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar({ onSearch }) {
  const formRef = useRef();
  const submit = useSubmit("/posts/search");

  const searchHandler = () => {
    if(onSearch) onSearch();
    submit(
      {
        mode: formRef.current.mode.value,
        target: formRef.current.target.value,
      },
      { method: "post", action: "/posts/search" }
    );
  };

  const keyDownHandler = async (e) => {
    if (e.key === "Enter") {
      if(onSearch) onSearch();
    }
  };

  return (
    <Form
      ref={formRef}
      method="post"
      action="/posts/search"
      className="mr-4 flex flex-row self-center"
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
          className="w-32 rounded-l-3xl py-1 pl-4 text-sm text-gray-800 outline-none"
          placeholder="Search..."
          onKeyDown={keyDownHandler}
        />
      </div>
      <select
        id="mode"
        name="mode"
        className="appearance-none rounded-r-3xl border-l border-gray-300 py-0 pl-1.5 pr-0.5 text-sm text-gray-800 outline-none"
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
