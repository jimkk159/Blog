import { Op } from "sequelize";
import { GetFeatures } from "./api-features";

vi.mock("sequelize");

describe("Class:GetFeatures", () => {
  test("should construct by Model and query ", () => {
    const Model = "Model";
    const query = { id: "test" };

    const getFeatures = new GetFeatures(Model, query);

    expect(getFeatures.Model).toBe(Model);
    expect(getFeatures.query).toEqual(query);
    expect(getFeatures.sqlQuery).toEqual({});
  });

  describe("filter()", () => {
    test.each([{ id: "1" }, { name: "Tom" }])(
      "should get obj key key equals target value if obj key equals target value",
      (query) => {
        const Model = "Model";

        const getFeatures = new GetFeatures(Model, query).filter();

        expect(getFeatures.query).toEqual(query);
        expect(getFeatures.sqlQuery).toEqual({ where: query });
      }
    );

    test.each([{ id: ["1", "2"] }, { name: ["Tom", "Amy"] }])(
      "should get obj key equals target array if obj key equals target array",
      (query) => {
        const Model = "Model";

        const getFeatures = new GetFeatures(Model, query).filter();

        expect(getFeatures.query).toEqual(query);
        expect(getFeatures.sqlQuery).toEqual({ where: query });
      }
    );

    test("should get obj which keys are replaced by sequelize Op", () => {
      const Model = "Model";
      const query = { id: { gte: "1" } };
      Op = { gte: "OpGte", lte: "OpLte" };

      const getFeatures = new GetFeatures(Model, query).filter();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({ where: { id: { OpGte: "1" } } });
    });

    test("should get obj match the filter rules", () => {
      const Model = "Model";
      const query = {
        A: "1",
        B: ["pen", "eraser"],
        C: { gte: "2" },
        D: NaN,
        E: { gte: "2", lte: "3" },
      };
      Op = { gte: "OpGte", lte: "OpLte" };

      const getFeatures = new GetFeatures(Model, query).filter();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({
        where: { A: "1", B: ["pen", "eraser"], C: { OpGte: "2" } },
      });
    });
  });

  describe("sort()", () => {
    test("should get empty obj if query.sort is empty", () => {
      const Model = "Model";
      const query = {};

      const getFeatures = new GetFeatures(Model, query).sort();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({});
    });

    test("should get obj with order if query.sort is provided", () => {
      const Model = "Model";
      const query = { sort: "A,-B" };

      const getFeatures = new GetFeatures(Model, query).sort();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({
        order: [
          ["A", "ASC"],
          ["B", "DESC"],
        ],
      });
    });
  });

  describe("select()", () => {
    test("should get empty obj if query.fields is empty", () => {
      const Model = "Model";
      const query = {};

      const getFeatures = new GetFeatures(Model, query).select();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({});
    });

    test("should get obj with attributes if positive fields are provided", () => {
      const Model = "Model";
      const query = { fields: "A,B,-C" };

      const getFeatures = new GetFeatures(Model, query).select();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({
        attributes: ["A", "B"],
      });
    });

    test("should get obj with exclude if positive fields are not provided and negative fields are provided", () => {
      const Model = "Model";
      const query = { fields: "-A,-B" };

      const getFeatures = new GetFeatures(Model, query).select();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({
        attributes: { exclude: ["A", "B"] },
      });
    });
  });

  describe("paginate()", () => {
    test("should get default paginate obj", () => {
      const Model = "Model";
      const query = {};

      const getFeatures = new GetFeatures(Model, query).paginate();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({ offset: 0, limit: 15 });
    });

    test("should change paginate page if req.offset is provided", () => {
      const Model = "Model";
      const query = { page: 2 };

      const getFeatures = new GetFeatures(Model, query).paginate();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({ offset: 15, limit: 15 });
    });

    test("should change paginate limit if req.limit is provided", () => {
      const Model = "Model";
      const query = { limit: 20 };

      const getFeatures = new GetFeatures(Model, query).paginate();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({ offset: 0, limit: 20 });
    });

    test("should change paginate page and limit if req.offset and req.limit are provided", () => {
      const Model = "Model";
      const query = { page: 3, limit: 100 };

      const getFeatures = new GetFeatures(Model, query).paginate();

      expect(getFeatures.query).toEqual(query);
      expect(getFeatures.sqlQuery).toEqual({ offset: 200, limit: 100 });
    });
  });
});
