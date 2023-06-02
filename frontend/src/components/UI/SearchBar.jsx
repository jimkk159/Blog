import { useRef } from "react";
import { Form, useSubmit } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar() {
  const formRef = useRef();
  const submit = useSubmit("/search");
  
  const searchHandler = () => {
    submit(
      {
        mode: formRef.current.mode.value,
        target: formRef.current.target.value,
      },
      { method: "post", action: "/search" }
    );
  };

  return (
    <Form
      ref={formRef}
      method="post"
      action="/search"
      className="mr-8 flex flex-row self-center"
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
          className="w-40 rounded-l-3xl py-0.5 pl-3 text-gray-800 outline-none"
          placeholder="Search..."
        />
      </div>
      <select
        id="mode"
        name="mode"
        className="appearance-none rounded-r-3xl border-l border-gray-300 px-1 py-0.5 text-gray-800 outline-none"
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
