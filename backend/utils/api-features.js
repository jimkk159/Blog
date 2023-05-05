import * as helper from "./helper/helper.js";
import * as apiFeatureHelper from "./helper/api-feature-helper.js";

export class GetFeatures {
  constructor(Model, query) {
    this.Model = Model;
    this.query = query;
    this.sqlQuery = {};
  }

  async findAll(queryString, options) {
    return this.Model.findAll(
      { ...this.sqlQuery, ...queryString },
      options
    );
  }

  filter() {
    let filterQuery = {};
    let queryObj = { ...this.query };
    const exlcude = ["sort", "limit", "page"];
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
    this.sqlQuery = { ...this.sqlQuery, where: filterQuery };
    return this;
  }

  sort() {
    let order;
    if (this.query.sort) {
      order = apiFeatureHelper.getQueryElements(this.query.sort);
      order = apiFeatureHelper.createSequelizeSort(order);
      this.sqlQuery = { ...this.sqlQuery, order };
    }
    return this;
  }

  select() {
    let attributes, exclude;
    if (this.query.fields) {
      const fields = apiFeatureHelper.getQueryElements(this.query.fields);
      attributes = apiFeatureHelper.createSequelizeAttributes(fields);
      if (attributes.length === 0) {
        exclude = apiFeatureHelper.createSequelizeExclude(fields);
        attributes = { exclude };
      }
      this.sqlQuery = { ...this.sqlQuery, attributes };
    }
    return this;
  }

  paginate() {
    const page = helper.toNaturalNumber(this.query.page) || 1;
    const limit = helper.toNaturalNumber(this.query.limit) || 15;
    const offset = (page - 1) * limit;
    this.sqlQuery = { ...this.sqlQuery, limit, offset };
    return this;
  }
}
