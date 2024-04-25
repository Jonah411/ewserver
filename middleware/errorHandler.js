const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        strackRace: err.strack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Failed",
        message: err.message,
        strackRace: err.strack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Un Authorized",
        message: err.message,
        strackRace: err.strack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        strackRace: err.strack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        strackRace: err.strack,
      });
      break;
    default:
      console.log("No Error All Are Good");
      break;
  }
};

module.exports = errorHandler;
