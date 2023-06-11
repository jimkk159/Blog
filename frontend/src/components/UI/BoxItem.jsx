import { Form, useNavigate } from "react-router-dom";

function BoxItem({ icon, to, action, empty, children, onClick }) {
  const navigate = useNavigate();

  const clickHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
    if (to) navigate(to);
  };

  if (to)
    return (
      <div
        className="flex h-[120px] w-[120px] flex-col items-center justify-center space-y-1 rounded-md border-2 border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        onClick={clickHandler}
      >
        {icon}
        <p className="font-bree-serif text-base">{children}</p>
      </div>
    );

  return (
    <Form method="post" action={action} onSubmit={(e) => onClick(e)}>
      <button
        type="submit"
        className="flex h-[120px] w-[120px] flex-col items-center justify-center space-y-1 rounded-md border-2 border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
      >
        {icon}
        <p className="font-bree-serif text-base">{children}</p>
      </button>
    </Form>
  );
}

export default BoxItem;
