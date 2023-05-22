import { Form } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar() {
  return (
    <Form
      method="post"
      action="/search"
      className="mr-16 flex flex-row self-center"
    >
      <div className="relative">
        <AiOutlineSearch className="absolute right-1 top-2 text-black" />
        <input
          id="target"
          name="target"
          type="text"
          className="rounded-l-3xl w-40 pl-3 py-0.5 text-gray-800 outline-none"
          placeholder="Search..."
        />
      </div>
      <select
        id="mode"
        name="mode"
        className="border-l border-gray-300 px-1 py-0.5 text-gray-800 outline-none rounded-r-3xl appearance-none"
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
