const { AuthenticationError } = require("./errors");
const { verifyJws } = require("./jwt-token-provider");

/**
 *
 * @param {{allowRoutes: string[]}} options
 */
function auth(options) {
  const { allowRoutes = [] } = options || {};
  return function (req, res, next) {
    if (allowRoutes?.includes(req.path)) {
      next();
    } else {
      const jws = req.get("Authorization")?.split(" ")?.[1];
      const jwt = jws && verifyJws(jws);

      if (jwt) {
        req.userId = jwt.sub;
        next();
      } else {
        const authError = new AuthenticationError();
        res.status(authError.status).json(authError.toObject());
      }
    }
  };
}

exports.auth = auth;
