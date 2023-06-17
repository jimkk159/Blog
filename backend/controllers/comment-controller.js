import Post from "../module/post.js";
import Comment from "../module/comment.js";
import * as helper from "../utils/helper/helper.js";
import catchAsync from "../utils/error/catch-async.js";
import * as errorTable from "../utils/error/error-table.js";
import * as commentHelper from "../utils/helper/comment-helper.js";

export const checkPermission = catchAsync(async (req, res, next) => {
  // 1) find post
  const comment = await Comment.findByPk(req.params.id);
  if (!comment) throw errorTable.commentNotFound();
  req.comment = comment;

  // 2) check user permissions
  if (req.user.role === "root") return next();
  commentHelper.checkUserUpdateCommentPermission(req.user, comment);

  next();
});

export const createOne = catchAsync(async (req, res, next) => {
  // 1) check Post
  const post = await Post.findByPk(req.body.PostId);
  if (!post) throw errorTable.postNotFound();

  // 2) create Comment
  const comment = await Comment.create({
    PostId: +req.body.PostId,
    AuthorId: req.user.id,
    content: helper.modeifiedSyntax(req.body.content),
  });

  // 4) get Post (Lazy Loading)
  const data = helper.removeKeys(comment.toJSON(), ["createdAt", "updatedAt"]);

  res.status(200).json({
    status: "success",
    data,
  });
});

export const updateOne = catchAsync(async (req, res, next) => {
  if (helper.isIncludeID(req.body)) throw errorTable.notAllowUpdateIDError();
  await Comment.update(
    { content: req.body.content },
    { where: { id: req.params.id } }
  );
  const data = await Comment.findByPk(req.params.id, { raw: true });

  res.status(200).json({
    status: "success",
    data,
  });
});
