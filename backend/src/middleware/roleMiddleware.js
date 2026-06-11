const { sendError } = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Role '${req.user.role}' is not authorized for this resource.`);
    }
    next();
  };
};

module.exports = { authorize };