import { redirect, json, useRouteLoaderData } from "react-router-dom";

import * as authHelper from "../../../utils/auth";
import AboutEditor from "../../../components/UI/Editor/About";
import { AwaitWrapper } from "../../../components/Wrapper/AwaitWrapper";

function EditAbout() {
  const { about } = useRouteLoaderData("about");
  return (
    <AwaitWrapper resolve={about}>
      {(about) => <AboutEditor method="post" about={about[0]} />}
    </AwaitWrapper>
  );
}

export default EditAbout;

export async function action({ request }) {
  const method = request.method;
  const data = await request.formData();
  const token = authHelper.getAuthToken();

  const aboutData = { content: data.get("content") };
  const url = process.env.REACT_APP_BACKEND_URL + "/api/v1/about";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(aboutData),
  });

  if (!response.ok)
    return json(
      { message: "Something wrong happen when updating about information..." },
      { status: 500 }
    );

  return redirect(`/about`);
}
