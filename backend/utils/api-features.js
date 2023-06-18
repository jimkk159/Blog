import * as helper from "./helper/helper.js";
import * as apiFeatureHelper from "./helper/api-feature-helper.js";

export class GetFeatures {
  constructor(Model, query) {
    this.Model = Model;
    this.query = query;
    this.sqlQuery = {};
  }

  async findAll(queryString, options) {
    return this.Model.findAll({ ...this.sqlQuery,...queryString }, options);
  }

  async count(queryString, options) {
    return this.Model.count({ ...this.sqlQuery, ...queryString }, options);
  }

  filter() {
    let filterQuery = {};
    let queryObj = { ...this.query };

    const exlcude = ["sort", "limit", "page", "count", "fields", "all"];
    const allowOperators = ["gt", "gte", "lt", "lte"];
    queryObj = apiFeatureHelper.sanitizeFilterObj(queryObj, allowOperators);
    filterQuery = apiFeatureHelper.replaceFilterOperators(queryObj);

    queryObj = { ...this.query };
    queryObj = apiFeatureHelper.getQueryItemShouldIn(queryObj);
    filterQuery = { ...filterQuery, ...queryObj };

    queryObj = { ...this.query };
    queryObj = apiFeatureHelper.getQueryItemEqualTo(queryObj);
    filterQuery = { ...filterQuery, ...queryObj };

    filterQuery = helper.removeKeys(filterQuery, exlcude);

    if (Object.keys(filterQuery).length)
      this.sqlQuery = { ...this.sqlQuery, where: filterQuery };
    return this;
  }

  sort() {
    let order;
    if (this.query.sort) {
      order = apiFeatureHelper.getQueryElements(this.query.sort);
      order = apiFeatureHelper.createSequelizeSort(order);
      this.sqlQuery = { ...this.sqlQuery, order };
    } else {
      this.sqlQuery = { ...this.sqlQuery, order: [["updatedAt", "DESC"]] };
    }
    return this;
  }

  select() {
    let attributes = {},
      include,
      exclude;
    if (this.query.fields) {
      const fields = apiFeatureHelper.getQueryElements(this.query.fields);

      include = apiFeatureHelper.createSequelizeAttributes(fields);
      exclude = apiFeatureHelper.createSequelizeExclude(fields);

      attributes = { include, exclude };
      this.sqlQuery = { ...this.sqlQuery, attributes };
    }
    return this;
  }

  paginate() {
    const page = helper.toNaturalNumber(this.query.page) || 1;
    const limit = helper.toNaturalNumber(this.query.limit) || 15;
    const offset = (page - 1) * limit;

    this.sqlQuery = !!+this.query.all
      ? { ...this.sqlQuery }
      : { ...this.sqlQuery, limit, offset };
    return this;
  }
}
