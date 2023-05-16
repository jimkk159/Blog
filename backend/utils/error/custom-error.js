import * as errorTable from "../error/error-table.js";

// ------------------SQL Error------------------
export const isSqlError = (error) =>
  !!(error.name && error.name.startsWith("Sequelize"));

export const createCustomSqlError = (error) => {
  if (error.name === "SequelizeDatabaseError")
    switch (error.parent.sqlState) {
      case "42000":
        return errorTable.dbSyntaxError();
      case "42S22":
        return errorTable.dbBadFieldsError();
      case "HY000":
        return errorTable.dbBadTimeStampError();
      default:
        console.log("Unknow SQL Error happened!");
    }
  if (error.name === "SequelizeValidationError")
    return errorTable.dbValidateError();
  if (error.name === "SequelizeUniqueConstraintError") {
    return errorTable.dbUniqueConstraintError(error.errors[0]);
  }
};
