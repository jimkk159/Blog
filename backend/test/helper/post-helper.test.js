import { Op } from "sequelize";
import sequelize from "../../config/db-init";

import User from "../../module/user";
import Tag from "../../module/tag";
import Post from "../../module/post";
import Category from "../../module/category";
import * as helper from "../../utils/helper/helper";
import * as ApiFeature from "../../utils/api-features";
import * as tagHelper from "../../utils/helper/tag-helper";
import * as errorTable from "../../utils/error/error-table";
import * as postHelper from "../../utils/helper/post-helper";
import * as categoryHelper from "../../utils/helper/category-helper";

const date = new Date(1998, 11, 19);
vi.useFakeTimers();
vi.setSystemTime(date);
vi.mock("sequelize");
describe("isValidSearch()", () => {
  let query, allowType, allowMode;
  beforeEach(() => {
    query = {};
    allowType = undefined;
    allowMode = undefined;
  });

  test("should return false if query does not provide mode", () => {
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if query does not provide type", () => {
    query = { mode: true };
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if query does not provide target", () => {
    query = { mode: true, type: true };
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if allowType is not array", () => {
    query = { mode: true, type: true, target: true };
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if allowMode is not array", () => {
    query = { mode: true, type: true, target: true };
    allowType = [];
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if allowType does not include query type", () => {
    query = { mode: true, type: true, target: true };
    allowType = [];
    allowMode = [];
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return false if allowMode does not include query mode", () => {
    query = { mode: true, type: "testType", target: true };
    allowType = ["testType"];
    allowMode = [];
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(false);
  });

  test("should return true if query is valid", () => {
    query = { mode: "testMode", type: "testType", target: true };
    allowType = ["testType"];
    allowMode = ["testMode"];
    const result = postHelper.isValidSearch(query, allowType, allowMode);
    expect(result).toBe(true);
  });
});

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
  let GetFeatures;
  beforeAll(() => {
    GetFeatures = {
      filter: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      paginate: vi.fn().mockReturnThis(),
      pop: vi.fn().mockReturnThis(),
      findByPk: vi.fn().mockImplementation(() => ({})),
    };
    vi.spyOn(helper, "isURL").mockImplementation(() => false);
    vi.spyOn(helper, "setDefault").mockImplementation(() => {});
    vi.spyOn(helper, "getImgUrlFromS3").mockImplementation(() => {});
    vi.spyOn(ApiFeature, "GetFeatures").mockImplementation(() => GetFeatures);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should set deault sort post by editedAt", async () => {
    const postId = "postId";
    const query = { sort: "testSort", pop: {} };
    helper.setDefault.mockImplementationOnce(() => "setDefaultedSort");

    await postHelper.getFullPost(postId, query);

    expect(helper.setDefault).toHaveBeenLastCalledWith("testSort", "editedAt");
  });

  test("should call GetFeatures() by Post Model and query", async () => {
    const postId = "postId";
    const query = { sort: {}, pop: {} };

    await postHelper.getFullPost(postId, query);

    expect(ApiFeature.GetFeatures).toHaveBeenLastCalledWith(Post, query);
  });

  test("should call GetFeatures filter", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query).catch(() => {});

    expect(GetFeatures.filter).toHaveBeenCalled();
  });

  test("should call GetFeatures sort", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query).catch(() => {});

    expect(GetFeatures.sort).toHaveBeenCalled();
  });

  test("should call GetFeatures select", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query).catch(() => {});

    expect(GetFeatures.select).toHaveBeenCalled();
  });

  test("should call GetFeatures paginate", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query).catch(() => {});

    expect(GetFeatures.paginate).toHaveBeenCalled();
  });

  test("should call GetFeatures pop", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query).catch(() => {});

    expect(GetFeatures.pop).toHaveBeenCalled();
  });

  test("should set default sort posts by editedAt from new to old", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };

    await postHelper.getFullPost(postId, query);

    expect(GetFeatures.findByPk).toHaveBeenLastCalledWith(postId, query);
  });

  test("should throw if post not exist", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    GetFeatures.findByPk.mockImplementationOnce(async () => {});

    let error;
    try {
      await postHelper.getFullPost(postId, query);
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(errorTable.idNotFoundError());
  });

  test("should not replace Author avatar if Author not exist", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    GetFeatures.findByPk.mockImplementationOnce(async () => ({}));

    await postHelper.getFullPost(postId, query);

    expect(helper.getImgUrlFromS3).not.toHaveBeenCalled();
  });

  test("should not replace Author avatar if avatar not exist", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    GetFeatures.findByPk.mockImplementationOnce(async () => ({ Author: "" }));

    await postHelper.getFullPost(postId, query);

    expect(helper.getImgUrlFromS3).not.toHaveBeenCalled();
  });

  test("should not replace Author avatar if avatar is url", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    helper.isURL.mockImplementationOnce(() => true);
    GetFeatures.findByPk.mockImplementationOnce(async () => ({
      Author: { avatar: "testAvatar" },
    }));

    await postHelper.getFullPost(postId, query);

    expect(helper.isURL).toHaveBeenLastCalledWith("testAvatar");
    expect(helper.getImgUrlFromS3).not.toHaveBeenCalled();
  });

  test("should replace Author avatar if avatar is not url", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    GetFeatures.findByPk.mockImplementationOnce(async () => ({
      Author: { avatar: "testAvatar" },
    }));

    await postHelper.getFullPost(postId, query);

    expect(helper.getImgUrlFromS3).toHaveBeenLastCalledWith("testAvatar");
  });

  test("should return target post if all good", async () => {
    const postId = "postId";
    const query = { pop: {}, sort: {} };
    helper.getImgUrlFromS3.mockImplementationOnce(() => "replacedAvatar");
    GetFeatures.findByPk.mockImplementationOnce(async () => ({
      id: "testPostId",
      Author: { avatar: "testAvatar" },
    }));

    const output = await postHelper.getFullPost(postId, query);

    expect(output).toEqual({
      id: "testPostId",
      Author: { avatar: "replacedAvatar" },
    });
  });
});

describe("getFullPosts()", () => {
  let GetFeatures;
  const testQuery = {
    pop: "testPoP",
    sort: "testSort",
    fields: "testFields",
  };
  beforeAll(() => {
    GetFeatures = {
      filter: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      paginate: vi.fn().mockReturnThis(),
      pop: vi.fn().mockReturnThis(),
      findAll: vi.fn(),
    };
    vi.spyOn(helper, "isURL").mockImplementation(() => false);
    vi.spyOn(helper, "setDefault").mockImplementation((input) => {
      const dict = {
        testSort: "testSettedDefaultSort",
        testFields: "testSettedDefaultFields",
      };
      return dict[input];
    });
    vi.spyOn(helper, "getImgUrlFromS3").mockImplementation(() => {});
    vi.spyOn(ApiFeature, "GetFeatures").mockImplementation(() => GetFeatures);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should set query sort and fields default value", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});

    expect(helper.setDefault).toHaveBeenCalledWith("testSort", "editedAt");
    expect(helper.setDefault).toHaveBeenCalledWith("testFields", "content");
  });

  test("should call GetFeatures by Post and query", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});

    expect(ApiFeature.GetFeatures).toHaveBeenLastCalledWith(Post, {
      pop: "Author,Category,Tag,testPoP",
      sort: "testSettedDefaultSort",
      fields: "testSettedDefaultFields",
    });
  });

  test("should call GetFeatures filter", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});
    expect(GetFeatures.filter).toHaveBeenCalled();
  });

  test("should call GetFeatures sort", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});
    expect(GetFeatures.sort).toHaveBeenCalled();
  });

  test("should call GetFeatures select", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});
    expect(GetFeatures.select).toHaveBeenCalled();
  });

  test("should call GetFeatures paginate", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});
    expect(GetFeatures.paginate).toHaveBeenCalled();
  });

  test("should call GetFeatures pop", async () => {
    await postHelper.getFullPosts({ ...testQuery }).catch(() => {});
    expect(GetFeatures.pop).toHaveBeenCalled();
  });

  test("should call GetFeatures findAll", async () => {
    const customQuery = "testCustomQuery";
    await postHelper
      .getFullPosts({ ...testQuery }, customQuery)
      .catch(() => {});
    expect(GetFeatures.findAll).toHaveBeenLastCalledWith(customQuery);
  });

  test("should not replace the posts author avatar if author does not exist", async () => {
    const posts = [{ toJSON: vi.fn().mockReturnThis() }];
    GetFeatures.findAll.mockImplementationOnce(() => posts);

    const result = await postHelper
      .getFullPosts({ ...testQuery })
      .catch(() => {});

    expect(result).toEqual(posts);
  });

  test("should not replace the posts author avatar if avatar does not exist", async () => {
    const posts = [{ toJSON: vi.fn().mockReturnThis(), Author: {} }];
    GetFeatures.findAll.mockImplementationOnce(() => posts);

    const result = await postHelper
      .getFullPosts({ ...testQuery })
      .catch(() => {});

    expect(result).toEqual(posts);
  });

  test("should not replace the posts author avatar if avatar is URL", async () => {
    const posts = [
      { toJSON: vi.fn().mockReturnThis(), Author: { avatar: "testAvatar" } },
    ];
    helper.isURL.mockImplementationOnce(() => true);
    GetFeatures.findAll.mockImplementationOnce(() => posts);

    const result = await postHelper
      .getFullPosts({ ...testQuery })
      .catch(() => {});

    expect(result).toEqual(posts);
  });

  test("should replace the posts author avatar", async () => {
    const posts = [
      { toJSON: vi.fn().mockReturnThis(), Author: { avatar: "testAvatar" } },
    ];
    helper.getImgUrlFromS3.mockImplementationOnce(() => "testAvatarFromS3");
    GetFeatures.findAll.mockImplementationOnce(() => posts);

    const result = await postHelper
      .getFullPosts({ ...testQuery })
      .catch(() => {});

    expect(helper.getImgUrlFromS3).toHaveBeenLastCalledWith("testAvatar");
    expect(posts[0].Author.avatar).toBe("testAvatarFromS3");
    expect(result).toEqual(posts);
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

  test("should throw error if tagIds is not legal", async () => {
    let error;
    const tagIds = "tagIds";
    tagHelper.isTagIdLegal.mockImplementationOnce(() => false);

    await postHelper.checkAndFindPostTags(tagIds).catch((err) => (error = err));

    expect(tagHelper.isTagIdLegal).toHaveBeenLastCalledWith(tagIds);
    expect(error).toEqual(errorTable.inputInvalidError("tagIds"));
  });

  test("should call tag findAll by tagIds", async () => {
    let error;
    const tagIds = "tagIds";

    await postHelper.checkAndFindPostTags(tagIds).catch((err) => (error = err));

    expect(Tag.findAll).toHaveBeenLastCalledWith({
      where: {
        id: tagIds,
      },
    });
  });

  test("should check tags consistency by finded tags and provided tagIds", async () => {
    let error;
    const tagIds = "tagIds";
    const testTagsFromDB = "testTagsFromDB";

    Tag.findAll.mockImplementationOnce(async () => testTagsFromDB);

    await postHelper.checkAndFindPostTags(tagIds).catch((err) => (error = err));

    expect(tagHelper.checkTagsConsistency).toHaveBeenLastCalledWith(
      testTagsFromDB,
      tagIds
    );
  });

  test("should return tags from database", async () => {
    let error;
    const tagIds = "tagIds";
    const testTagsFromDB = "testTagsFromDB";

    Tag.findAll.mockImplementationOnce(async () => testTagsFromDB);

    const result = await postHelper
      .checkAndFindPostTags(tagIds)
      .catch((err) => (error = err));

    expect(result).toBe(testTagsFromDB);
  });
});

describe("createPostWithTags()", () => {
  let addTags, session, post;
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
    session = vi.fn();
    addTags = vi.fn(async () => {});
    post = { addTags };
    vi.spyOn(Post, "create").mockImplementation(() => post);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (fn) =>
      fn(session)
    );
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
      transaction: session,
    });
  });

  test("should add Post tags by property", async () => {
    let error;

    await postHelper.createPostWithTags(input).catch((err) => (error = err));

    expect(addTags).toHaveBeenLastCalledWith(input.tags, {
      transaction: session,
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
  let setTags, session, post;
  const postInput = {
    postId: "testPostId",
    title: "testTitle",
    content: "testContent",
    summary: "testSummary",
    CategoryId: "testCategoryId",
    previewImg: "testPreviewImg",
    editedAt: Date.now(),
  };
  const input = {
    ...postInput,
    isUpdateTags: true,
    tags: "testTags",
  };

  beforeAll(() => {
    session = vi.fn();
    setTags = vi.fn(async () => {});
    post = { setTags };
    vi.spyOn(Post, "update").mockImplementation(() => {});
    vi.spyOn(Post, "findByPk").mockImplementation(() => post);
    vi.spyOn(sequelize, "transaction").mockImplementation(async (fn) =>
      fn(session)
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

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(Post.findByPk).toHaveBeenLastCalledWith(input.postId);
  });

  test("should transact sequelize by property", async () => {
    await postHelper.updatePostContentAndTags(input).catch(() => {});

    expect(sequelize.transaction).toHaveBeenCalled();
  });

  test("should update Post by property", async () => {
    await postHelper.updatePostContentAndTags(input).catch(() => {});

    expect(Post.update).toHaveBeenLastCalledWith(
      {
        title: input.title,
        content: input.content,
        summary: input.summary,
        CategoryId: input.CategoryId,
        previewImg: input.previewImg,
        editedAt: Date.now(),
      },
      { where: { id: input.postId }, transaction: session }
    );
  });

  test("should set tags if isUpdateTags is true", async () => {
    let error;

    await postHelper
      .updatePostContentAndTags(input)
      .catch((err) => (error = err));

    expect(setTags).toHaveBeenLastCalledWith(input.tags, {
      transaction: session,
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

describe("getCategorySearchQueryByText()", () => {
  beforeAll(() => {
    vi.spyOn(Category, "findAll").mockImplementation(async () => []);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Category by target text", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";

    await postHelper.getCategorySearchQueryByText(target);

    expect(Category.findAll).toHaveBeenLastCalledWith({
      where: {
        name: {
          [Op.like]: `%${target}%`,
        },
      },
    });
  });

  test("should return initQuery by CategoryId", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";
    Category.findAll.mockImplementationOnce(async () => [
      { id: "TestCategoryId_1" },
      { id: "TestCategoryId_2" },
    ]);

    const result = await postHelper.getCategorySearchQueryByText(target);

    expect(result).toEqual([
      { CategoryId: ["TestCategoryId_1", "TestCategoryId_2"] },
      {},
    ]);
  });
});

describe("getAuthorSearchQueryByText()", () => {
  beforeAll(() => {
    vi.spyOn(User, "findAll").mockImplementation(async () => []);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find User by target text", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";

    await postHelper.getAuthorSearchQueryByText(target);

    expect(User.findAll).toHaveBeenLastCalledWith({
      where: {
        name: {
          [Op.like]: `%${target}%`,
        },
      },
    });
  });

  test("should return initQuery by AuthorId", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";
    User.findAll.mockImplementationOnce(async () => [
      { id: "TestAuthorId_1" },
      { id: "TestAuthorId_2" },
    ]);

    const result = await postHelper.getAuthorSearchQueryByText(target);

    expect(result).toEqual([
      { AuthorId: ["TestAuthorId_1", "TestAuthorId_2"] },
      {},
    ]);
  });
});

describe("getTitleySearchQueryByText()", () => {
  test("should return forceQuery", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";

    const result = await postHelper.getTitleySearchQueryByText(target);

    expect(result).toEqual([
      {},
      {
        where: {
          title: {
            [Op.like]: `%${target}%`,
          },
        },
      },
    ]);
  });
});

describe("getTagSearchQueryByText()", () => {
  let GetFeatures;

  beforeAll(() => {
    GetFeatures = {
      filter: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      paginate: vi.fn().mockReturnThis(),
      findAll: vi.fn().mockImplementation(async () => []),
      pop: vi.fn().mockReturnThis(),
    };
    vi.spyOn(Tag, "findAll").mockImplementation(async () => []);
    vi.spyOn(ApiFeature, "GetFeatures").mockImplementation(() => GetFeatures);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should find Tag by target text", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";

    await postHelper.getTagSearchQueryByText(target);

    expect(Tag.findAll).toHaveBeenLastCalledWith({
      where: {
        name: {
          [Op.like]: `%${target}%`,
        },
      },
    });
  });

  test("should find posts by provided tags", async () => {
    Op = { like: "likeOperator" };
    const target = "testTarget";
    Tag.findAll.mockImplementationOnce(async () => [
      { id: "TestTagId_1" },
      { id: "TestTagId_2" },
    ]);

    await postHelper.getTagSearchQueryByText(target);

    expect(GetFeatures.findAll).toHaveBeenLastCalledWith({
      include: [
        {
          model: Tag,
          where: { id: ["TestTagId_1", "TestTagId_2"] },
          through: { attributes: [] },
        },
      ],
      raw: true,
    });
  });

  test("should find posts by provided tags", async () => {
    Op = { like: "likeOperator", in: "inOperator" };
    const target = "testTarget";
    Tag.findAll.mockImplementationOnce(async () => [
      { id: "TestTagId_1" },
      { id: "TestTagId_2" },
    ]);
    GetFeatures.findAll.mockImplementationOnce(async () => [
      { id: "TestPostId_1" },
      { id: "TestPostId_2" },
    ]);

    const result = await postHelper.getTagSearchQueryByText(target);

    expect(result).toEqual([
      {},
      { where: { id: { [Op.in]: ["TestPostId_1", "TestPostId_2"] } } },
    ]);
  });
});

describe("getSearchQueryById()", () => {
  let GetFeatures;

  beforeAll(() => {
    GetFeatures = {
      filter: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      paginate: vi.fn().mockReturnThis(),
      findAll: vi.fn().mockImplementation(async () => []),
      pop: vi.fn().mockReturnThis(),
    };
    vi.spyOn(ApiFeature, "GetFeatures").mockImplementation(() => GetFeatures);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should search Category by target id", async () => {
    const target = "testTarget";

    const result = await postHelper.getSearchQueryById("category", target);

    expect(result).toEqual([{ CategoryId: target }, {}]);
  });

  test("should search Author by target id", async () => {
    const target = "testTarget";

    const result = await postHelper.getSearchQueryById("author", target);

    expect(result).toEqual([{ AuthorId: target }, {}]);
  });

  test("should search posts by provided tag id", async () => {
    const target = "testTarget";

    await postHelper.getSearchQueryById("tag", target);

    expect(GetFeatures.findAll).toHaveBeenLastCalledWith({
      include: [
        {
          model: Tag,
          where: { id: target },
          through: { attributes: [] },
        },
      ],
      raw: true,
    });
  });

  test("should return search posts query by provided tag id", async () => {
    Op = { in: "inOperator" };
    const target = "testTarget";
    GetFeatures.findAll.mockImplementationOnce(async () => [
      { id: "TestPostId_1" },
      { id: "TestPostId_2" },
    ]);

    const result = await postHelper.getSearchQueryById("tag", target);

    expect(result).toEqual([
      {},
      { where: { id: { [Op.in]: ["TestPostId_1", "TestPostId_2"] } } },
    ]);
  });
});

describe("getSearchQueryByText()", () => {
  beforeAll(() => {
    vi.spyOn(postHelper, "getCategorySearchQueryByText").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "getAuthorSearchQueryByText").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "getTitleySearchQueryByText").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "getTagSearchQueryByText").mockImplementation(
      async () => {}
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should search Category by target text", async () => {
    const target = "testTarget";
    vi.spyOn(postHelper, "getCategorySearchQueryByText").mockImplementation(
      async () => "testCategorySearchQuery"
    );

    const result = await postHelper.getSearchQueryByText("category", target);

    expect(postHelper.getCategorySearchQueryByText).toHaveBeenLastCalledWith(
      target
    );
    expect(result).toBe("testCategorySearchQuery");
  });

  test("should search Author by target text", async () => {
    const target = "testTarget";
    vi.spyOn(postHelper, "getAuthorSearchQueryByText").mockImplementation(
      async () => "testAuthorSearchQuery"
    );

    const result = await postHelper.getSearchQueryByText("author", target);

    expect(postHelper.getAuthorSearchQueryByText).toHaveBeenLastCalledWith(
      target
    );
    expect(result).toBe("testAuthorSearchQuery");
  });

  test("should search Title by target text", async () => {
    const target = "testTarget";
    vi.spyOn(postHelper, "getTitleySearchQueryByText").mockImplementation(
      async () => "testTitleSearchQuery"
    );

    const result = await postHelper.getSearchQueryByText("title", target);

    expect(postHelper.getTitleySearchQueryByText).toHaveBeenLastCalledWith(
      target
    );
    expect(result).toBe("testTitleSearchQuery");
  });

  test("should search Tag by target text", async () => {
    const target = "testTarget";
    vi.spyOn(postHelper, "getTagSearchQueryByText").mockImplementation(
      async () => "testTagSearchQuery"
    );

    const result = await postHelper.getSearchQueryByText("tag", target);

    expect(postHelper.getTagSearchQueryByText).toHaveBeenLastCalledWith(target);
    expect(result).toBe("testTagSearchQuery");
  });
});

describe("getSearchQuery()", () => {
  beforeAll(() => {
    vi.spyOn(postHelper, "getSearchQueryById").mockImplementation(
      async () => {}
    );
    vi.spyOn(postHelper, "getSearchQueryByText").mockImplementation(
      async () => {}
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should search by id", async () => {
    const mode = "testMode";
    const type = "id";
    const target = "testTarget";
    vi.spyOn(postHelper, "getSearchQueryById").mockImplementation(
      async () => "testSearchQueryById"
    );

    const result = await postHelper.getSearchQuery(mode, type, target);

    expect(postHelper.getSearchQueryById).toHaveBeenLastCalledWith(
      mode,
      target
    );
    expect(result).toBe("testSearchQueryById");
  });

  test("should search by text", async () => {
    const mode = "testMode";
    const type = "text";
    const target = "testTarget";
    vi.spyOn(postHelper, "getSearchQueryByText").mockImplementation(
      async () => "testSearchQueryByText"
    );

    const result = await postHelper.getSearchQuery(mode, type, target);

    expect(postHelper.getSearchQueryByText).toHaveBeenLastCalledWith(
      mode,
      target
    );
    expect(result).toBe("testSearchQueryByText");
  });
});
