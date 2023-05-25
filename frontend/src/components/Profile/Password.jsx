import { Form } from "react-router-dom";

function Password({ onCancel }) {
  return (
    <Form
      method="post"
      action="/update_password"
      className="flex h-full w-full flex-col space-y-4 bg-orange-500 "
    >
      <div className="flex flex-col space-y-1">
        <label htmlFor="password">Old password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="h-8 w-48 rounded px-2 text-black outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="newPassword">Password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="h-8 w-48 rounded px-2 text-black outline-none"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="confirmNewPassword">Password again</label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          className="h-8 w-48 rounded px-2 text-black outline-none"
        />
      </div>
      <div className="flex justify-end space-x-4 py-4 pr-4">
        <button
          type="submit"
          className="box-border rounded border-[1px] bg-transparent px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
        >
          Confrim
        </button>
        <button
          type="button"
          className="box-border rounded bg-blue-600 px-4 py-1 text-center font-roboto text-lg text-white hover:bg-blue-700"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}

export default Password;
