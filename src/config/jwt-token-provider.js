const jwt = require("jsonwebtoken");

/**
 * Sign jwt claims
 * @author Opezyhick
 * @param {string} userId
 */
function signJwt(userId, audience = process.env.JWT_AUDIENCE) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    issuer: process.env.JWT_ISSUER,
    audience: audience,
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

/**
 * Sign jwt claims
 * @author Opezyhick
 * @param {string} token
 */
function verifyJws(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {}
  return null;
}

/**
 * Parse jws to jwt claims
 * @author Opezyhick
 * @param {string} token
 */
function parseJws(token) {
  return jwt.decode(token);
}

/**
 * Refresh jws claims
 * @author Opezyhick
 * @param {string} token
 */
function refreshJws(token) {}

function stripBearer(authorization) {
  if (authorization) {
    return authorization.split(" ")[1];
  }
  return "";
}

module.exports = { signJwt, verifyJws, parseJws, refreshJws, stripBearer };
