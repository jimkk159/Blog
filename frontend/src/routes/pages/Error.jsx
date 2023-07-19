import { useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();

  let title = "An error occurred";
  let message = "Unknown Error";
  console.log(error);
  if (error.status === 500) {
    message = error?.data?.message;
  }

  if (error.status === 404) {
    title = "Not found";
    message = error?.data?.message;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}

export default Error;
