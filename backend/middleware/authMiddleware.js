const authMiddleware = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
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