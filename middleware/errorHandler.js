const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.json({ message: res.message, strackRace: err.strack });
};

module.exports = errorHandler;
