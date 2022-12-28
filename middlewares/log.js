const logger = require('../middlewares/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message);
  next(err);
};
