function errorHandler(error, req, res, next) {
  if (error.code === "ER_DUP_ENTRY") {
    return res
      .status(409)
      .json({ error: "A user with that email already exists" });
  }

  console.error(error);
  return res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
