import { Dummy_blogs, Dummy_search } from "./Dummy_data.js";
let count = 0;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

let blogs = Dummy_blogs;
export const getPost = async (req, res, next) => {
  const postId = req.params.pid;
  //For Debug
  count += 1;
  console.log("Get Post " + count);
  // await sleep(3000);
  res.json(blogs[postId]);
};

export const getPosts = async (req, res, next) => {
  //For Debug
  count += 1;
  console.log("Get All Posts " + count);
  // await sleep(3000);
  const queryNumber = req.query.number >= 1 ? req.query.number : 1;
  const queryStartPage = req.query.start >= 0 ? req.query.start : 0;
  const queryResponse = blogs.slice(
    queryStartPage,
    queryStartPage + queryNumber
  );
  res.json(queryResponse);
};

export const getPostSearch = async (req, res, next) => {
  //For Debug
  console.log("Get Post Search");
  const searchTarget = req.query.search;
  const result = [];

  //Level 1 Search Author
  if (result.length < 150) {
    const searchAuthor = blogs.filter((x) => {
      return x.author.toLowerCase() === searchTarget.toLowerCase();
    });
    result.push(...searchAuthor);
  }

  //Level 2 Search topic
  if (result.length < 150) {
    const searchTopics = blogs.filter(
      (x) => x.topic.toLowerCase() === searchTarget.toLowerCase()
    );
    result.push(...searchTopics);
  }

  //Level 3 Search include title
  if (result.length < 150) {
    const searchTitles = blogs.filter((x) => {
      if (x.language?.title?.ch?.include(searchTarget)) return true;
      return x.language?.title?.en
        ?.toLowerCase()
        .include(searchTarget.toLowerCase());
    });
    result.push(...searchTitles);
  }

  console.log("search", searchTarget, result);
  res.json(result);
};

export const deletePost = async (req, res, next) => {
  //For Debug
  console.log("Delete Post");
  // await sleep(3000);
  const deletePostId = req.params.pid;
  try {
    blogs = blogs.filter((blog) => {
      return blog.id !== +deletePostId;
    });
  } catch (err) {}

  res.status(200).json({ message: `Deleted post id:${req.params.pid}` });
};
