export const addPostAuthor = async (req, res, next) => {
  const author = res.locals.author;
  const targetPost = res.locals.post;

  res.locals.response = {
    ...targetPost,
    authorName: author.name,
    authorAvatar: author.avatar,
  };
  next();
};

export const addPostsAuthor = async (req, res, next) => {
  const targetPosts = res.locals.posts;
  const authors = res.locals.authors;
  let result = targetPosts;

  //Not Any Posts
  if (targetPosts.length === 0) return res.json(result);

  try {
    //Create the Obj with userid as key
    let userObj = {};
    authors.forEach((author) => {
      const uid = author.id;
      userObj[uid] = author;
    });

    //loop through the post and add the author information
    result = targetPosts.map((targetPost) => {
      const authorId = targetPost.author_id;
      if (authorId in userObj) {
        targetPost = {
          ...targetPost,
          authorName: userObj[authorId].name,
          authorAvatar: userObj[authorId].avatar,
        };
      }
      return targetPost;
    });
  } catch (err) {
    const error = new HttpError(
      "Get Posts Error!, please try again later.",
      500
    );
    return next(error);
  }

  res.locals.response = result;
  next();
};
