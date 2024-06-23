function errorHandler(err, req, res, next) {
  // unauthorized error
  if (err.name === "UnauthorizedError")
    return res.status(401).json({ message: "user unauthorized", error: err.message });

  // validation error
  if (err.name === "ValidationError")
    return res.status(401).json({ message: err });

  // internal server error
  return res.status(500).json(err);
}

module.exports = errorHandler;