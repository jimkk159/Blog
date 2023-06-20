import Post from "../module/post.js";
import Comment from "../module/comment.js";
import * as helper from "../utils/helper/helper.js";
import { GetFeatures } from "../utils/api-features.js";
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

export const getAll = catchAsync(async (req, res, next) => {
  req.query.sort = req.query.sort
    ? req.query.sort.includes("editedAt")
      ? req.query.sort
      : req.query.sort + " -editedAt"
    : "-editedAt";

  const getFeature = new GetFeatures(Comment, req.query)
    .filter()
    .sort()
    .select()
    .paginate()
    .pop();

  const data = await getFeature.findAll();
  // await helper.getAvatarsUrlFromS3(data);

  res.status(200).json({
    status: "success",
    count: data.length,
    data,
  });
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
    editedAt: Date.now(),
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
    { content: helper.modeifiedSyntax(req.body.content), editedAt: Date.now() },
    { where: { id: req.params.id } }
  );
  const data = await Comment.findByPk(req.params.id, { raw: true });

  res.status(200).json({
    status: "success",
    data,
  });
});
