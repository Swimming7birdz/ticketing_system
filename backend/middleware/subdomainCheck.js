module.exports = function (req, res, next) {
  const host = req.get("host");
  if (host === "api.helpdesk.asucapstonetools.com") {
    next(); // Continue if host matches the subdomain
  } else {
    res.status(404).send("Not found");
  }
};
