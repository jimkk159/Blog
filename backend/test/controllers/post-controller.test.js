import * as helper from "../../utils/helper/helper";
import * as errorTable from "../../utils/error/error-table";
import * as postHelper from "../../utils/helper/post-helper";
import * as postController from "../../controllers/post-controller";
import Category from "../../module/category";
import User from "../../module/user";
import { describe, expect } from "vitest";
import Post from "../../module/post";
import { GetFeatures } from "../../utils/api-features";

vi.mock("sequelize");
vi.mock("../../utils/api-features");
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
    req = { params: { id: "testID" }, query: "testQuery" };

    await postController.getOne(req, res, next).catch((err) => (error = err));

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(
      req.params.id,
      req.query
    );
  });

  test("should throw error if post not found", async () => {
    let error;
    req = { params: { id: "testID" } };

    await postController.getOne(req, res, next).catch((err) => (error = err));
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.idNotFoundError());
  });

  test("should call increase the post views if get post", async () => {
    let error;
    const increment = vi.fn().mockImplementationOnce(async () => {});
    const post = { increment };
    req = { params: { id: "testID" } };
    postHelper.getFullPost.mockResolvedValueOnce(post);

    await postController.getOne(req, res, next).catch((err) => (error = err));

    expect(increment).toHaveBeenLastCalledWith({ views: 1 });
  });

  test("should response post", async () => {
    let error;
    const post = { increment: vi.fn().mockImplementationOnce(async () => {}) };
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
    vi.spyOn(Post, "count").mockImplementation(async () => {});
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

  test("should count the total posts number", async () => {
    let error;
    req = { count: "testCountQuery" };

    await postController.getAll(req, res, next).catch((err) => (error = err));

    expect(Post.count).toHaveBeenLastCalledWith({ where: req.count });
  });

  test("should response posts", async () => {
    let error;
    const data = { count: 1, rows: ["testRows"] };
    req = { query: "testQuery" };
    postHelper.getFullPosts.mockResolvedValueOnce(data);
    Post.count.mockResolvedValueOnce("testTotal");

    await postController.getAll(req, res, next).catch((err) => (error = err));

    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenLastCalledWith({
      status: "success",
      count: data.length,
      data,
      total: "testTotal",
    });
  });
});

describe("createOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(helper, "removeKeys").mockImplementation(() => {});
    vi.spyOn(helper, "isImgURL").mockImplementation(() => {});
    vi.spyOn(helper, "modeifiedSyntax").mockImplementation(() => {});
    vi.spyOn(User, "findByPk").mockImplementation(async () => {});
    vi.spyOn(Category, "findByPk").mockImplementation(async () => {});
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

  test("should find category by CategoryId", async () => {
    let error;
    const category = "testCategory";
    req = { body: { CategoryId: "CategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.body.CategoryId);
    expect(postHelper.checkPostCategory).toHaveBeenLastCalledWith(category);
  });

  test("should check and find post tags if tagIds is provided", async () => {
    let error;
    req = { body: { tagIds: "tagIds" } };

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).toHaveBeenLastCalledWith(
      req.body.tagIds
    );
  });

  test("should not check and find post tags if tagIds is not provided", async () => {
    let error;
    req = { body: {} };

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(postHelper.checkAndFindPostTags).not.toHaveBeenCalled();
  });

  test("should sanitize title, summary, content", async () => {
    let error;
    const category = { id: "CategoryId" };
    const tags = ["testTags"];
    req = {
      body: {
        title: "testTitle",
        content: "testContent",
        summary: "testSummary",
        previewImg: "testPreviewImg",
        tagIds: "tagIds",
      },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.checkAndFindPostTags.mockResolvedValueOnce(tags);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(helper.modeifiedSyntax).toHaveBeenCalledWith(req.body.title);
    expect(helper.modeifiedSyntax).toHaveBeenCalledWith(req.body.summary);
    expect(helper.modeifiedSyntax).toHaveBeenCalledWith(req.body.content);
  });

  test("should created post with tags", async () => {
    let error;
    const category = { id: "CategoryId" };
    const tags = ["testTags"];
    req = {
      body: {
        title: "testTitle",
        content: "testContent",
        summary: "testSummary",
        previewImg: "testPreviewImg",
        tagIds: "tagIds",
      },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.checkAndFindPostTags.mockResolvedValueOnce(tags);
    helper.isImgURL.mockReturnValueOnce(true);
    const dictionary = {
      testTitle: "modifiedTestTitle",
      testSummary: "modifiedTestSummary",
      testContent: "modifiedTestContent",
    };
    helper.modeifiedSyntax.mockImplementation((input) => dictionary[input]);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(helper.modeifiedSyntax).toHaveBeenCalled;
    expect(postHelper.createPostWithTags).toHaveBeenLastCalledWith({
      title: "modifiedTestTitle",
      content: "modifiedTestContent",
      summary: "modifiedTestSummary",
      CategoryId: category.id,
      AuthorId: req.user.id,
      previewImg: "testPreviewImg",
      tags,
    });
  });

  test("should created post with empty previewImg if previewImg is not an URL", async () => {
    let error;
    const category = { id: "CategoryId" };
    const tags = ["testTags"];
    req = {
      body: {
        title: "testTitle",
        content: "testContent",
        summary: "testSummary",
        previewImg: "testPreviewImg",
        tagIds: "tagIds",
      },
      user: { id: "testUserId" },
    };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.checkAndFindPostTags.mockResolvedValueOnce(tags);
    helper.isImgURL.mockReturnValueOnce(false);
    const dictionary = {
      testTitle: "modifiedTestTitle",
      testSummary: "modifiedTestSummary",
      testContent: "modifiedTestContent",
    };
    helper.modeifiedSyntax.mockImplementation((input) => dictionary[input]);

    await postController
      .createOne(req, res, next)
      .catch((err) => (error = err));

    expect(helper.modeifiedSyntax).toHaveBeenCalled;
    expect(postHelper.createPostWithTags).toHaveBeenLastCalledWith({
      title: "modifiedTestTitle",
      content: "modifiedTestContent",
      summary: "modifiedTestSummary",
      CategoryId: category.id,
      AuthorId: req.user.id,
      previewImg: "",
      tags,
    });
  });

  test("should find user by post authorId", async () => {
    let error;
    const category = { id: "CategoryId" };
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
    const category = { id: "CategoryId" };
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
      "createdAt", "updatedAt"
    ]);
  });

  test("should response created post", async () => {
    let error;
    const category = { id: "CategoryId" };
    const tags = { tags: "testTags" };
    const post = {
      AuthorId: "AuthorId",
      toJSON: vi.fn().mockReturnValueOnce("testPost"),
    };
    const author = { author: "testAuthor" };
    const data = { data: "testData" };
    req = {
      body: {
        title: "testTitle",
        content: "testContent",
        tagIds: "testTagIds",
      },
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

describe("checkPermission()", () => {
  let req, res, next;

  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
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

  test("should find Post by params id", async () => {
    req = { params: { id: "testId" } };

    await postController.checkPermission(req, res, next);

    expect(Post.findByPk).toHaveBeenLastCalledWith(req.params.id);
  });

  test("should throw error if post does not exist", async () => {
    req = { params: { id: "testId" } };

    await postController.checkPermission(req, res, next);

    expect(next).toHaveBeenLastCalledWith(errorTable.postNotFound());
  });

  test("should allow root user to update post", async () => {
    const post = "testPost";
    req = { params: { id: "testId" }, user: { role: "root" } };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController.checkPermission(req, res, next);

    expect(postHelper.checkUserUpdatePostPermission).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  test("should check if user allow to update post", async () => {
    const post = "testPost";
    req = { params: { id: "testId" }, user: { role: "user" } };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController.checkPermission(req, res, next);

    expect(postHelper.checkUserUpdatePostPermission).toHaveBeenLastCalledWith(
      req.user,
      post
    );
    expect(next).toHaveBeenCalled();
  });
});

describe("updateOne()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
    vi.spyOn(helper, "modifySyntax").mockImplementation((input) => input);
    vi.spyOn(postHelper, "checkAndFindPostTags").mockImplementation(
      async () => {}
    );
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

  test("should check and find post tags if tagIds is provided", async () => {
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: { tagIds: "testTagIds" },
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController.updateOne(req, res, next);

    expect(postHelper.checkAndFindPostTags).toHaveBeenLastCalledWith(
      req.body.tagIds
    );
  });

  test("should not check and find post tags if tagIds is not provided", async () => {
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: {},
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);

    await postController.updateOne(req, res, next);

    expect(postHelper.checkAndFindPostTags).not.toHaveBeenCalled();
  });

  test("should update post content and tags", async () => {
    const post = "testPost";
    const tags = ["testTags"];
    req = {
      params: { id: "testId" },
      body: {
        title: "testTitle",
        content: "testContent",
        tagIds: "testTagIds",
      },
      user: "testUser",
    };
    Post.findByPk.mockResolvedValueOnce(post);
    postHelper.checkAndFindPostTags.mockReturnValueOnce(tags);

    await postController.updateOne(req, res, next);

    expect(postHelper.updatePostContentAndTags).toHaveBeenLastCalledWith({
      postId: req.params.id,
      title: req.body.title,
      content: req.body.content,
      isUpdateTags: true,
      tags,
    });
  });

  test("should get post by id", async () => {
    req = {
      params: { id: "testId" },
      body: {
        title: "testTitle",
        content: "testContent",
        tagIds: "testTagIds",
      },
      query: "testQuery",
    };
    postHelper.checkAndFindPostTags.mockImplementationOnce(async () => [
      "testTag",
    ]);

    await postController.updateOne(req, res, next);

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(
      req.params.id,
      req.query
    );
  });

  test("should response post", async () => {
    let error;
    const post = "testPost";
    req = {
      params: { id: "testId" },
      body: {
        title: "testTitle",
        content: "testContent",
        tagIds: "testTagIds",
      },
    };
    postHelper.checkAndFindPostTags.mockImplementationOnce(async () => [
      "testTag",
    ]);
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
    vi.spyOn(postHelper, "checkPostCategory").mockImplementation(() => {});
    vi.spyOn(postHelper, "getFullPost").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Category by id", async () => {
    let error;
    req = { params: { id: "testId", CategoryId: "testCategoryId" } };

    await postController
      .updateCategory(req, res, next)
      .catch((err) => (error = err));

    expect(Category.findByPk).toHaveBeenLastCalledWith(req.params.CategoryId);
  });

  test("should check post category", async () => {
    const category = "testCategory";
    req = { params: { id: "testId", CategoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController.updateCategory(req, res, next);

    expect(postHelper.checkPostCategory).toHaveBeenLastCalledWith(category);
  });

  test("should update post", async () => {
    const category = { id: "testCategoryId" };
    req = { params: { id: "testId", CategoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController.updateCategory(req, res, next);

    expect(Post.update).toHaveBeenLastCalledWith(
      {
        CategoryId: category.id,
      },
      { where: { id: req.params.id } }
    );
  });

  test("should get post", async () => {
    const category = { id: "testCategoryId" };
    req = {
      params: { id: "testId", CategoryId: "testCategoryId" },
      query: "testQuery",
    };
    Category.findByPk.mockResolvedValueOnce(category);

    await postController.updateCategory(req, res, next);

    expect(postHelper.getFullPost).toHaveBeenLastCalledWith(
      req.params.id,
      req.query
    );
  });

  test("should response the updated category post", async () => {
    const category = { id: "testCategoryId" };
    const post = "testPost";
    req = { params: { id: "testId", CategoryId: "testCategoryId" } };
    Category.findByPk.mockResolvedValueOnce(category);
    postHelper.getFullPost.mockResolvedValueOnce(post);

    await postController.updateCategory(req, res, next);

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
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
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

describe("getMe()", () => {
  let req, res, next;
  beforeAll(() => {
    next = vi.fn();
  });

  test("should add self information into the request query", async () => {
    req = { user: { id: "testUserId" }, query: { origin: "testQueryOrigin" } };

    await postController.getMe(req, res, next);

    expect(req.query).toEqual({
      ...req.query,
      mode: "author",
      type: "id",
      target: "" + req.user.id,
    });
    expect(next).toHaveBeenCalled();
  });
});

describe("search()", () => {
  let req, res, next;
  beforeAll(() => {
    req = {};
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
    vi.spyOn(postHelper, "isValidSearch").mockImplementation(() => true);
    vi.spyOn(postHelper, "getSearchQuery").mockImplementation(async () => {});
    vi.spyOn(helper, "keepKeys").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should valid the search by request query, allowType, allowMode", async () => {
    await postController.search(req, res, next);

    expect(postHelper.isValidSearch).toHaveBeenLastCalledWith(
      req.query,
      ["id", "text"],
      ["category", "author", "title", "tag"]
    );
  });

  test("should throw error if the search aprams is not valid", async () => {
    let error;
    postHelper.isValidSearch.mockImplementationOnce(() => false);

    await postController.search(req, res, next);
    error = next.mock.calls[0][0];

    expect(error).toEqual(errorTable.wrongSearchParamsError());
  });

  test("should create the database instruction by request query", async () => {
    req.query = {
      mode: "testMode",
      type: "testType",
      target: "testTarget",
    };

    await postController.search(req, res, next);

    expect(postHelper.getSearchQuery).toHaveBeenLastCalledWith(
      req.query.mode,
      req.query.type,
      req.query.target
    );
  });

  test("should request query be setted to", async () => {
    const initQuery = { initQueryKey: "testInitQueryValue" };
    const forceQuery = "testForceQuery";
    req.query = {
      mode: "testMode",
      type: "testType",
      target: "testTarget",
    };
    postHelper.getSearchQuery.mockImplementationOnce(async () => [
      initQuery,
      forceQuery,
    ]);
    helper.keepKeys.mockImplementationOnce(() => ({
      keepKeyskey: "testKeepKeysValue",
    }));

    await postController.search(req, res, next);

    expect(helper.keepKeys).toHaveBeenLastCalledWith(
      {
        mode: "testMode",
        type: "testType",
        target: "testTarget",
      },
      ["sort", "limit", "page", "fields", "all"]
    );
    expect(req.query).toEqual({
      keepKeyskey: "testKeepKeysValue",
      ...initQuery,
    });
  });

  test("should request customQuery be setted to", async () => {
    const forceQuery = "testForceQuery";

    postHelper.getSearchQuery.mockImplementationOnce(async () => [
      {},
      forceQuery,
    ]);

    await postController.search(req, res, next);

    expect(req.customQuery).toEqual(forceQuery);
  });

  test("should request customQuery be setted to", async () => {
    const initQuery = { initQueryKey: "testInitQueryValue" };

    postHelper.getSearchQuery.mockImplementationOnce(async () => [
      initQuery,
      {},
    ]);

    await postController.search(req, res, next);

    expect(req.count).toEqual(initQuery);
  });

  test("should request customQuery be setted to", async () => {
    await postController.search(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
