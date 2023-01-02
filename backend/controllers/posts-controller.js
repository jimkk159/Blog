import { Dummy_blogs, Dummy_search } from "./Dummy_data.js";
let count = 0;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  //For Debug
  count += 1;
  console.log("Get Post " + count);
  // await sleep(3000);
  res.json(Dummy_blogs[postId]);
};

export const getPosts = async (req, res, next) => {
  //For Debug
  count += 1;
  console.log("Get All Posts " + count);
  // await sleep(3000);
  res.json(Dummy_blogs);
};

export const getPostSearch = async (req, res, next) => {
  //For Debug
  console.log("Get Post Search");
  const searchTarget = req.query.search;
  const result = [];
  if (result.length < 150) {
    const searchAuthor = Dummy_blogs.filter((x) => {
      return x.author.toLowerCase() === searchTarget.toLowerCase();
    });
    result.push(...searchAuthor);
  }
  if (result.length < 150) {
    const searchTopics = Dummy_blogs.filter(
      (x) => x.topic.toLowerCase() === searchTarget.toLowerCase()
    );
    result.push(...searchTopics);
  }
  if (result.length < 150) {
    const searchTitles = Dummy_blogs.filter((x) => {
      if (x.language?.title?.ch?.include(searchTarget)) return true;
      return x.language?.title?.en
        ?.toLowerCase()
        .include(searchTarget.toLowerCase());
    });
    result.push(...searchTitles);
  }
  console.log(result);

  console.log("search", searchTarget, result);
  res.json(result);
};
