import { Form } from "react-router-dom";

function SearchBar() {
  return (
    <Form method="post" action="/search" className="m-4 self-center flex flex-row">
      <input id="target" name="target" type="text" />
      <select id="mode" name="mode">
        <option value="category">Topic</option>
        <option value="title">Title</option>
        <option value="tag">Tag</option>
        <option value="author">Author</option>
      </select>
      <button>Search</button>
    </Form>
  );
}

export default SearchBar;
