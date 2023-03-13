import helper from "./helper.js";
import queryPool from "../module/mysql/pool.js";
import { id_, post_ } from "../utils/table.js";
import postModel from "../module/mysql/post-model.js";

const identifyAuthor = (post, uid) => {
  //Check Post Owner
  if (post?.author_id !== uid) throw new HttpError("Permissions deny.", 403);
};

const identifyPost = async (pid) => {
  const post = await queryPool.getOne(post_, [id_], [pid]);
  //Post not find
  if (!post) throw new HttpError("Post not Find!", 404);
  return post;
};

const removePostDuplicate = (originId, related, limit) => {
  return (
    helper
      .removeDuplicatesById(related)
      .filter((element) => element.id !== originId)
      .slice(0, limit) ?? []
  );
};

const restructPost = (post) => {
  const postObj = helper.getObjWithoutKeys(post, ["tags"], ["en_", "ch_"]);
  const tags = post.tags ? post.tags.split(",") : [];

  const en = helper.convertPrefix(post, "en_") ?? {};
  const ch = helper.convertPrefix(post, "ch_") ?? {};

  return {
    ...postObj,
    tags,
    content: {
      en,
      ch,
    },
  };
};

const getTopicRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post.related];
  const relatedLimit = +limit || 5;

  //Find Related Topic
  if (limit > related.length) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          topic_id: post.topic_id,
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

const getTagRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post.related];
  const tag = "`tag`";
  const relatedLimit = +limit || 5;

  //Find Related Topic
  if (limit > related.length && post?.tags.length > 0) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          [`${tag}.${tag}`]: post.tags.join(","),
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

const getAuthorRelatedPost = async (post, limit) => {
  if (!post?.related || !Array.isArray(post?.related)) {
    post.related = [];
  }

  let related = [...post?.related];
  const relatedLimit = +limit || 5;

  //Find Related Author
  if (limit > related.length) {
    related = [
      ...related,
      ...(
        await postModel.getAllPost({
          author_id: post?.author_id,
          limit: relatedLimit + 2,
        })
      ) //Get Related Posts
        .map((elemnt) => restructPost(elemnt)), //Restruct Post
    ];

    related = removePostDuplicate(post.id, related, relatedLimit + 2);
    return {
      ...post,
      related,
    };
  }
  return post;
};

export default {
  identifyAuthor,
  identifyPost,
  removePostDuplicate,
  restructPost,
  getTopicRelatedPost,
  getTagRelatedPost,
  getAuthorRelatedPost,
};
