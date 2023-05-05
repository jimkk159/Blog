import Tag from "../../module/tag";
import Post from "../../module/post";
import * as postHelper from "./post-helper";
import * as errorTable from "../table/error";
import * as ApiFeature from "../api-features";
import * as tagHelper from "../helper/tag-helper";
import * as categoryHelper from "../helper/category-helper";
import { beforeAll, describe, expect } from "vitest";
import sequelize from "../../config/db-init";

describe("isUserAllowUpdatePost()", () => {
  test("should return true if user role is root", () => {
    const user = { id: "A", role: "root" };
    const post = { AuthorId: "B" };

    const result = postHelper.isUserAllowUpdatePost(user, post);

    expect(result).toBe(true);
  });

  test("should return false if user role is root", () => {
    const user = { id: "A", role: "user" };
    const post = { AuthorId: "B" };

    const result = postHelper.isUserAllowUpdatePost(user, post);

    expect(result).toBe(false);
  });

  test("should return true if user is the post owner", () => {
    const user = { id: "A", role: "user" };
    const post = { AuthorId: "A" };

    const result = postHelper.isUserAllowUpdatePost(user, post);

    expect(result).toBe(true);
  });

  test("should return false if user is not the post owner", () => {
    const user = { id: "A", role: "user" };
    const post = { AuthorId: "B" };

    const result = postHelper.isUserAllowUpdatePost(user, post);

    expect(result).toBe(false);
  });
});

describe("getFullPost()", () => {
  beforeAll(() => {
    vi.spyOn(Post, "findByPk").mockImplementation(async () => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should get Post by property", async () => {
    const postId = "postId";

    await postHelper.getFullPost(postId);

    expect(Post.findByPk).toHaveBeenLastCalledWith(postId, {
      include: [
        "Author",
        "Category",
        { model: Tag, through: { attributes: [] } },
      ],
    });
  });
});

describe("getFullPosts()", () => {
  let GetFeatures;
  beforeAll(() => {
    GetFeatures = {
      filter: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      paginate: vi.fn().mockReturnThis(),
      findAll: vi.fn(),
    };
    vi.spyOn(ApiFeature, "GetFeatures").mockImplementation(() => GetFeatures);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should call GetFeatures by Post and query", async () => {
    let error;
    const testQuery = "testQuery";

    await postHelper.getFullPosts(testQuery).catch((err) => (error = err));

    expect(ApiFeature.GetFeatures).toHaveBeenLastCalledWith(Post, testQuery);
  });

  test("should call GetFeatures filter", async () => {
    let error;
    await postHelper.getFullPosts().catch((err) => (error = err));

    expect(GetFeatures.filter).toHaveBeenCalled();
  });

  test("should call GetFeatures sort", async () => {
    let error;

    await postHelper.getFullPosts().catch((err) => (error = err));

    expect(GetFeatures.sort).toHaveBeenCalled();
  });

  test("should call GetFeatures select", async () => {
    let error;

    await postHelper.getFullPosts().catch((err) => (error = err));

    expect(GetFeatures.select).toHaveBeenCalled();
    expect(GetFeatures.paginate).toHaveBeenCalled();
  });

  test("should call GetFeatures paginate", async () => {
    let error;

    await postHelper.getFullPosts().catch((err) => (error = err));

    expect(GetFeatures.paginate).toHaveBeenCalled();
  });

  test("should call GetFeatures findAll", async () => {
    let error;
    const customQuery = {
      include: [
        "Author",
        "Category",
        { model: Tag, through: { attributes: [] } },
      ],
    };

    await postHelper.getFullPosts().catch((err) => (error = err));

    expect(GetFeatures.findAll).toHaveBeenLastCalledWith(customQuery);
  });
});

describe("checkPostCategory()", () => {
  beforeAll(() => {
    vi.spyOn(categoryHelper, "isRoot").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if category not found", () => {
    let error;

    try {
      postHelper.checkPostCategory();
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.categoryNotFound());
  });

  test("should throw error if category is root", () => {
    let error;
    const testCategory = {};
    categoryHelper.isRoot.mockImplementationOnce(() => true);

    try {
      postHelper.checkPostCategory(testCategory);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.notAllowChoiceRootError());
  });
});

describe("checkAndFindPostTags()", () => {
  beforeAll(() => {
    vi.spyOn(Tag, "findAll").mockImplementation(() => {});
    vi.spyOn(tagHelper, "isTagIdLegal").mockImplementation(() => true);
    vi.spyOn(tagHelper, "checkTagsConsistency").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if tagId is not legal", async () => {
    let error;
    const tagId = "tagId";
    tagHelper.isTagIdLegal.mockImplementationOnce(() => false);

    await postHelper.checkAndFindPostTags(tagId).catch((err) => (error = err));

    expect(tagHelper.isTagIdLegal).toHaveBeenLastCalledWith(tagId);
    expect(error).toEqual(errorTable.inputInvalidError("tagId"));
  });

  test("should call tag findAll by tagId", async () => {
    let error;
    const tagId = "tagId";

    await postHelper.checkAndFindPostTags(tagId).catch((err) => (error = err));

    expect(Tag.findAll).toHaveBeenLastCalledWith({
      where: {
        id: tagId,
      },
    });
  });

  test("should check tags consistency by finded tags and provided tagId", async () => {
    let error;
    const tagId = "tagId";
    const testTagsFromDB = "testTagsFromDB";

    Tag.findAll.mockImplementationOnce(async () => testTagsFromDB);

    await postHelper.checkAndFindPostTags(tagId).catch((err) => (error = err));

    expect(tagHelper.checkTagsConsistency).toHaveBeenLastCalledWith(
      testTagsFromDB,
      tagId
    );
  });

  test("should return tags from database", async () => {
    let error;
    const tagId = "tagId";
    const testTagsFromDB = "testTagsFromDB";

    Tag.findAll.mockImplementationOnce(async () => testTagsFromDB);

    const result = await postHelper
      .checkAndFindPostTags(tagId)
      .catch((err) => (error = err));

    expect(result).toBe(testTagsFromDB);
  });
});

describe("createPostWithTags()", () => {
  let addTags, transact, post;
  const postInput = {
    title: "testTitle",
    content: "testContent",
    CategoryId: "testCategoryId",
    AuthorId: "testAuthorId",
  };
  const input = {
    ...postInput,
    tags: "testTags",
  };
  beforeAll(() => {
    transact = vi.fn();
    addTags = vi.fn(async () => {});
    post = { addTags };
    vi.spyOn(Post, "create").mockImplementation(() => post);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (cb) => {
      cb(transact);
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should transact sequelize by property", async () => {
    let error;

    await postHelper.createPostWithTags(input).catch((err) => (error = err));

    expect(sequelize.transaction).toHaveBeenCalled();
  });

  test("should create Post by property", async () => {
    let error;

    await postHelper.createPostWithTags(input).catch((err) => (error = err));

    expect(Post.create).toHaveBeenLastCalledWith(postInput, {
      transaction: transact,
    });
  });

  test("should add Post tags by property", async () => {
    let error;

    await postHelper.createPostWithTags(input).catch((err) => (error = err));

    expect(addTags).toHaveBeenLastCalledWith(input.tags, {
      transaction: transact,
    });
  });

  test("should return post", async () => {
    let error;

    const result = await postHelper
      .createPostWithTags(input)
      .catch((err) => (error = err));

    expect(result).toBe(post);
  });
});

describe("checkUserUpdatePostPermission()", () => {
  beforeAll(() => {
    vi.spyOn(postHelper, "isUserAllowUpdatePost").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should throw error if post not exist", () => {
    expect(() => postHelper.checkUserUpdatePostPermission()).toThrow(
      errorTable.postNotFound()
    );
  });

  test("should throw error if user is not allow to update post", () => {
    let error;
    const user = {};
    const post = {};
    postHelper.isUserAllowUpdatePost.mockImplementationOnce(() => false);

    try {
      postHelper.checkUserUpdatePostPermission(user, post);
    } catch (err) {
      error = err;
    }

    expect(postHelper.isUserAllowUpdatePost).toHaveBeenLastCalledWith(
      user,
      post
    );
    expect(error).toEqual(errorTable.permissionDenyError());
  });
});

describe("updatePostContentAndTags()", () => {
  let setTags, transact, post;
  const postInput = {
    postId: "testPostId",
    title: "testTitle",
    content: "testContent",
  };
  const input = {
    ...postInput,
    isUpdateTags: true,
    tags: "testTags",
  };
  beforeAll(() => {
    transact = vi.fn();
    setTags = vi.fn(async () => {});
    post = { setTags };
    vi.spyOn(Post, "update").mockImplementation(() => {});
    vi.spyOn(Post, "findByPk").mockImplementation(() => post);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (cb) => {
      cb(transact);
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Post by id", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(Post.findByPk).toHaveBeenLastCalledWith(input.postId);
  });

  test("should transact sequelize by property", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(sequelize.transaction).toHaveBeenCalled();
  });

  test("should update Post by property", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(Post.update).toHaveBeenLastCalledWith(
      {
        title: input.title,
        content: input.content,
      },
      { where: { id: input.postId }, transaction: transact }
    );
  });

  test("should set tags if isUpdateTags is true", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(setTags).toHaveBeenLastCalledWith(input.tags, {
      transaction: transact,
    });
  });

  test("should not set tags if isUpdateTags is false", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags({ ...input, isUpdateTags: false })
      .catch((err) => (error = err));

    expect(setTags).not.toHaveBeenCalled();
  });
});
