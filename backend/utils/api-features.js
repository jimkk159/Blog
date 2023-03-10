import { sqlApos, pushIn } from "./helper.js";

class getFeatures {
  constructor(table, queryString, vals) {
    this.table = table;
    this.queryString = queryString;
    this.query = `SELECT * FROM ${table}`;
    this.values = Array.isArray(vals) ? [...vals] : [];
  }

  join(type, table, condition) {
    if (type === "LEFT") {
      this.query = this.query + ` LEFT`;
    } else if (type === "RIGHT") {
      this.query = this.query + ` RIGHT`;
    } else if (type === "INNER") {
      this.query = this.query + ` INNER`;
    }
    this.query = this.query + ` JOIN ${table} ON ${condition}`;
    return this;
  }

  limitFields(defaultFields) {
    let fields = defaultFields
      ? [...new Set(defaultFields)].map((element) => `${sqlApos(element)}`) //Remove duplicate and duplicate apostrophe
      : "*";
    if (this.queryString?.fields) {
      const queryFields = [
        ...new Set(
          this.queryString?.fields
            .split(",")
            .map((element) => `${sqlApos(element)}`) //Remove duplicate and duplicate apostrophe
        ),
      ];
      //Drop the query not in default
      if (fields !== "*")
        fields = fields.filter((element) => queryFields.includes(element));
      else fields = queryFields;
    }

    //Prevent the empty fields
    if (Array.isArray(fields) && fields.length === 0)
      fields = defaultFields ? defaultFields : "*";
    if (fields !== "*") {
      fields = fields.map((element) => `${element}`).join(",");
      this.query = this.query.replace("SELECT *", `SELECT ${fields}`);
    }
    return this;
  }

  group(target) {
    this.query = this.query + ` GROUP BY ${target}`;
    return this;
  }

  appendQuery(queryString) {
    this.queryString = { ...this.queryString, ...queryString };
    return this;
  }

  appendValues(vals) {
    this.values = [...this.values, ...vals];
    return this;
  }

  changeTable(newTable) {
    this.query = this.query.replace(
      new RegExp("FROM\\s+" + this.table, "i"),
      "FROM " + newTable
    );
    this.table = newTable;
    return this;
  }
}

class getOneFeatures extends getFeatures {
  filter() {
    const queryObj = { ...this.queryString };
    //Check if query
    if (Object.keys(queryObj).length === 0) return this;

    //Filtering
    let [query, values] = Object.entries(queryObj).reduce(
      ([q, v], [key, value]) => {
        pushIn(q, key, "=");
        v.push(value);
        return [q, v];
      },
      [[], []]
    );

    if (!!query.length) {
      query = " WHERE " + query.join(" AND "); // remove the last " AND "
      this.query = this.query + query;
      this.values = [...this.values, ...values];
    }

    return this;
  }
}

class getAllFeatures extends getFeatures {
  filterMany(col, vals) {
    if (col && Array.isArray(vals) && vals.length > 0) {
      this.query = this.query + ` WHERE ${col} IN (?)`;
      this.values = [...this.values, [...vals]];
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    //Remove functionality already provided
    const queryFields = ["page", "sort", "limit", "fields"];
    queryFields.forEach((element) => delete queryObj[element]);

    //Check if query
    if (Object.keys(queryObj).length === 0) return this;

    //Filtering
    let [query, values] = Object.entries(queryObj).reduce(
      ([q, v], [key, value]) => {
        let key_ =
          key.indexOf(".") === -1 ? `\`${this.table}\`.\`${key}\`` : key;
        if (!value) return [q, v];
        if (typeof value === "object" && Array.isArray(value) === false) {
          return Object.entries(value).reduce(
            ([q, v], [operator, val]) => {
              if (val.indexOf(",") !== -1) return [q, v]; //Ignore the many case
              switch (operator) {
                case "gte":
                  pushIn(q, key_, ">=");
                  v.push(val);
                  break;
                case "gt":
                  pushIn(q, key_, ">");
                  v.push(val);
                  break;
                case "lte":
                  pushIn(q, key_, "<=");
                  v.push(val);
                  break;
                case "lt":
                  pushIn(q, key_, "<");
                  v.push(val);
                  break;
                default:
                  // ignore unknown operators
                  break;
              }
              return [q, v];
            },
            [q, v]
          );
        } else if (("" + value).indexOf(",") !== -1) {
          pushIn(q, key_, "IN", true);
          v.push(value.split(","));
        } else {
          pushIn(q, key_, "=");
          v.push(value);
        }
        return [q, v];
      },
      [[], []]
    );

    if (!!query.length) {
      query = " WHERE " + query.join(" AND "); // remove the last " AND "
      this.query = this.query + query;
      this.values = [...this.values, ...values];
    }
    return this;
  }

  sort(demand) {
    if (demand) {
      this.query = this.query + " ORDER BY " + demand;
      return this;
    }

    let sortBy = [];
    if (this.queryString?.sort) {
      sortBy = this.queryString.sort.split(",").map((element) => {
        if (element.startsWith("-")) return `\`${element.slice(1)}\` DESC`;
        else return `\`${element}\``;
      });
    }

    //No matter what we want the latest post to user
    if (!sortBy.some((element) => element.includes("update"))) {
      sortBy.push("`update`");
    }
    this.query = this.query + " ORDER BY" + sortBy.join(", ");

    return this;
  }

  paginate() {
    const page = +this.queryString?.page > 0 ? +this.queryString?.page || 1 : 1;
    const limit =
      +this.queryString?.limit > 0 ? +this.queryString?.limit || 100 : 100;
    const offset = (page - 1) * limit;
    this.query = this.query + " LIMIT ? OFFSET ?";
    this.values = [...this.values, limit, offset];
    return this;
  }
}

export default { getOneFeatures, getAllFeatures };
