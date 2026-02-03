const { verifytoken } = require("../service/auth");

function checkforauth(cookieName) {
  return function (req, res, next) {
    const token = req.cookies[cookieName];

    if (!token) {
      return next();
    }

    try {
      const user = verifytoken(token);
      req.user = user;
      return next();
    } catch (err) {
      return next();
    }
  };
}

module.exports = checkforauth;
