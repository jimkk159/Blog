import * as helper from "../utils/helper/helper";
import * as errorTable from "../utils/table/error";
import * as postHelper from "../utils/helper/post-helper";
import * as postController from "../controllers/post-controller";
import Category from "../module/category";
import User from "../module/user";
import { describe } from "vitest";
import Post from "../module/post";

describe("getOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(postHelper, "getFullPost").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find post by parameter Id", async () => {
    let error;
    req = { params: { id: "testID" } };

    await postController.getOne(req, res, next).catch((err) => (error = err));

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should throw error if post not found", async () => {
    let error;
    req = { params: { id: "testID" } };

    await postController.getOne(req, res, next).catch((err) => (error = err));
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.idNotFoundError());
  });

  test("should response post", async () => {
    let error;
    const post = "testPost";
    req = { params: { id: "testID" } };
    postHelper.getFullPost.mockResolvedValueOnce(post);

    await postController.getOne(req, res, next).catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: post,
    });
  });
});

describe("getAll()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(postHelper, "getFullPosts").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find post by query", async () => {
    let error;
    req = { query: "testQuery" };

    await postController.getAll(req, res, next).catch((err) => (error = err));

    expect(postHelper.getFullPosts).toHaveBeenLastCalledWith(
      req.query,
      req.customQuery
    );
  });

  test("should find post by customQuery", async () => {
    let error;
    req = { customQuery: "testCustomeQuery" };

    await postController.getAll(req, res, next).catch((err) => (error = err));

    expect(postHelper.getFullPosts).toHaveBeenLastCalledWith(
      req.query,
      req.customQuery
    );
  });

  test("should response posts", async () => {
    let error;
    const data = { count: 1, rows: ["testRows"] };
    req = { query: "testQuery" };
    postHelper.getFullPosts.mockResolvedValueOnce(data);

    await postController.getAll(req, res, next).catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      count: data.length,
      data,
    });
  });
});

describe("createOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
    vi.spyOn(helper, "removeKeys").mockImplementation(() => {});
    vi.spyOn(postHelper, "checkPostCategory").mockImplementation(() => {});
    vi.spyOn(postHelper, "checkAndFindPostTags").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "createPostWithTags").mockImplementation(
      async () => {}
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find category by categoryId", async () => {
    let error;
    const category = "testCategory";
    req = { body: { categoryId: "categoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.body.categoryId);
    expect(postHelper.checkPostCategory).toHaveBeenLastCalledWith(category);
  });

  test("should check and find post tags if tagId is provided", async () => {
    let error;
    req = { body: { tagId: "tagId" } };

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).toHaveBeenLastCalledWith(
      req.body.tagId
    );
  });

  test("should not check and find post tags if tagId is not provided", async () => {
    let error;
    req = { body: {} };

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).not.toHaveBeenCalled();
  });

  test("should created post with tags", async () => {
    let error;
    const category = { id: "categoryId" };
    const tags = "testTags";
    req = {
      body: { title: "testTitle", content: "testContent", tagId: "tagId" },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.checkAndFindPostTags.mockResolvedValueOnce(tags);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.createPostWithTags).toHaveBeenLastCalledWith({
      title: req.body.title,
      content: req.body.content,
      CategoryId: category.id,
      AuthorId: req.user.id,
      tags,
    });
  });

  test("should find user by post authorId", async () => {
    let error;
    const category = { id: "categoryId" };
    req = {
      body: { title: "testTitle", content: "testContent" },
      user: { id: "testUserId" },
    };
    const post = { AuthorId: "testAuthorId" };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.createPostWithTags.mockResolvedValueOnce(post);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(User.findByPk).toHaveBeenLastCalledWith(post.AuthorId);
  });

  test("should remove post date information", async () => {
    let error;
    const category = { id: "categoryId" };
    const post = {
      AuthorId: "AuthorId",
      toJSON: vi.fn().mockReturnValueOnce("testPost"),
    };
    req = {
      body: { title: "testTitle", content: "testContent" },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.createPostWithTags.mockResolvedValueOnce(post);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(helper.removeKeys).toHaveBeenLastCalledWith("testPost", [
      "createdAt",
    ]);
  });

  test("should response created post", async () => {
    let error;
    const category = { id: "categoryId" };
    const tags = { tags: "testTags" };
    const post = {
      AuthorId: "AuthorId",
      toJSON: vi.fn().mockReturnValueOnce("testPost"),
    };
    const author = { author: "testAuthor" };
    const data = { data: "testData" };
    req = {
      body: { title: "testTitle", content: "testContent", tagId: "testTagId" },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.checkAndFindPostTags.mockResolvedValueOnce(tags);
    postHelper.createPostWithTags.mockResolvedValueOnce(post);
    User.findByPk.mockResolvedValueOnce(author);
    helper.removeKeys.mockReturnValueOnce(data);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: { ...data, Author: author, Category: category, Tags: tags },
    });
  });
});

describe("updateOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
    vi.spyOn(postHelper, "checkUserUpdatePostPermission").mockImplementation(
      () => {}
    );
    vi.spyOn(postHelper, "checkAndFindPostTags").mockImplementation(() => {});
    vi.spyOn(postHelper, "updatePostContentAndTags").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "getFullPost").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Post by id", async () => {
    let error;
    req = { params: { id: "testId" } };

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(Post.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should check whether user has permission to update post", async () => {
    let error;
    const post = "testPost";
    req = { params: { id: "testId" }, user: "testUser" };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkUserUpdatePostPermission).toHaveBeenLastCalledWith(
      req.user,
      post
    );
  });

  test("should check and find post tags if tagId is provided", async () => {
    let error;
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: { tagId: "testTagId" },
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).toHaveBeenLastCalledWith(
      req.body.tagId
    );
  });

  test("should not check and find post tags if tagId is not provided", async () => {
    let error;
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: {},
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).not.toHaveBeenCalled();
  });

  test("should update post content and tags", async () => {
    let error;
    const post = "testPost";
    const tags = "testTags";
    req = {
      params: { id: "testId" },
      body: { title: "testTitle", content: "testContent", tagId: "testTagId" },
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);
    postHelper.checkAndFindPostTags.mockReturnValueOnce(tags);

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.updatePostContentAndTags).toHaveBeenLastCalledWith({
      postId: req.params.id,
      title: req.body.title,
      content: req.body.content,
      isUpdateTags: true,
      tags,
    });
  });

  test("should get post by id", async () => {
    let error;
    req = {
      params: { id: "testId" },
      body: { title: "testTitle", content: "testContent", tagId: "testTagId" },
    };

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should response post", async () => {
    let error;
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: { title: "testTitle", content: "testContent", tagId: "testTagId" },
    };
    postHelper.getFullPost.mockResolvedValueOnce(post);

    await postController
      .updateOne(req, res, next)
      .catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: post,
    });
  });
});

describe("updateCategory()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Post, "update").mockImplementation(async () => {});
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
    vi.spyOn(postHelper, "checkUserUpdatePostPermission").mockImplementation(
      () => {}
    );
    vi.spyOn(postHelper, "checkPostCategory").mockImplementation(() => {});
    vi.spyOn(postHelper, "getFullPost").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Post by id", async () => {
    let error;
    req = { params: { id: "testId" } };

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(Post.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should check whether user has permission to update post", async () => {
    let error;
    const post = "testPost";
    req = { params: { id: "testId" }, user: "testUser" };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkUserUpdatePostPermission).toHaveBeenLastCalledWith(
      req.user,
      post
    );
  });

  test("should find Category by id", async () => {
    let error;
    req = { params: { id: "testId", categoryId: "testCategoryId" } };

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.params.categoryId);
  });

  test("should check post category", async () => {
    let error;
    const category = "testCategory";
    req = { params: { id: "testId", categoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkPostCategory).toHaveBeenLastCalledWith(category);
  });

  test("should update post", async () => {
    let error;
    const category = { id: "testCategoryId" };
    req = { params: { id: "testId", categoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(Post.update).toHaveBeenLastCalledWith(
      {
        CategoryId: category.id,
      },
      { where: { id: req.params.id } }
    );
  });

  test("should get post", async () => {
    let error;
    const category = { id: "testCategoryId" };
    req = { params: { id: "testId", categoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should response the updated category post", async () => {
    let error;
    const category = { id: "testCategoryId" };
    const post = "testPost";
    req = { params: { id: "testId", categoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.getFullPost.mockResolvedValueOnce(post);

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      data: post,
    });
  });
});

describe("deleteOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Post, "destroy").mockImplementation(async () => {});
    vi.spyOn(postHelper, "checkUserUpdatePostPermission").mockImplementation(
      () => {}
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Post by id", async () => {
    let error;
    req = { params: { id: "testId" } };

    await postController
      .deleteOne(req, res, next)
      .catch((err) => (error = err));

    expect(Post.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should check whether user has permission to update post", async () => {
    let error;
    const post = "testPost";
    req = { params: { id: "testId" }, user: "testUser" };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController
      .deleteOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkUserUpdatePostPermission).toHaveBeenLastCalledWith(
      req.user,
      post
    );
  });

  test("should delete post", async () => {
    let error;
    req = { params: { id: "testId" } };

    await postController
      .deleteOne(req, res, next)
      .catch((err) => (error = err));

    expect(Post.destroy).toHaveBeenLastCalledWith({
      where: { id: req.params.id },
    });
  });

  test("should response the updated category post", async () => {
    let error;
    req = { params: { id: "testId" } };

    await postController
      .deleteOne(req, res, next)
      .catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(204);
    expect(res.json).toHaveBeenCalled();
  });
});
