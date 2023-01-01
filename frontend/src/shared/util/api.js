export async function getPosts() {
  const response = await fetch(process.env.REACT_APP_BACKEND_URL + "posts");
  if (!response.ok) {
    throw { message: "failed to fetch posts", status: 500 };
  }
  return response.json();
}
