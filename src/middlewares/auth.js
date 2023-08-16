const passport = require("passport");
const httpStatus = require("http-status");
const { roleRights } = require("../config/roles");

const verifyCallback = (req, res, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Please authenticate" });
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return res.status(httpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
  }
  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, verifyCallback(req, res, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
