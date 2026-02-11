const { getUser } = require("../service/auth");

function checkAuth(cookieName) {
  return function (req, res, next) {
    const token = req.cookies?.[cookieName];

    if (!token) {
      req.user = null;
      return next();
    }

    const payload = getUser(token);

    if (!payload) {
      return res.redirect("/login");
    }

    req.user = payload;
    next();
  };
}

module.exports = checkAuth;
