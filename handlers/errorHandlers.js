// Catch errors handler
exports.catchErrors = fn => function (req, res, next) {
  return fn(req, res, next).catch(next);
};

// Not found errors
exports.notFound = (req, res) => {
  res.status(201).json({ status: 404, message: 'Not found' });
};

