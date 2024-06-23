require("dotenv/config");
const { expressjwt: jwt } = require("express-jwt");

function jwtAuth() {
  const secret = process.env.SECRET;

  return jwt({
    secret: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/users\/login/ },
      { url: /\/users\/register/ },
    ],
  });
}

async function isRevoked(req, jwt) {
  const payload = jwt.payload;

  if (!payload.isAdmin) return true;

  return false;
}

module.exports = jwtAuth;
