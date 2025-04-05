const jwt = require("jsonwebtoken");
// minor change for git tracking
const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        console.log("No token provided.");
        return res.status(403).json({ error: "No token provided" });
    }

    const bearerToken = token.split(" ")[1];
    console.log(" Token received:", bearerToken);

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {

      if (err) {
        return res.status(404).json({ error: "Failed to authenticate token" });
      }
      req.user = decoded;
      next();
    });
},

isAdmin: (req, res, next) => {
  console.log("Checking Admin Privileges:", req.user);
  if (req.user && req.user.role === "admin") {
      console.log("User is Admin. Access granted.");
      next();
    } else {
      res.status(405).json({ error: "Forbidden" });
    }
  },
  isStudent: (req, res, next) => {
    if (req.user && req.user.role === "student") {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  },
  isTA: (req, res, next) => {
    if (req.user && req.user.role === "TA") {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  },
  isTAOrAdmin: (req, res, next) => {
    if (req.user && (req.user.role === "TA" || req.user.role === "admin")) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  },
  isStudentOrTAOrAdmin: (req, res, next) => {
    if (req.user && (req.user.role === "student" || req.user.role === "TA" || req.user.role === "admin")) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  },
};

module.exports = authMiddleware;
