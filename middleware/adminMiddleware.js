/**
 * Allow access only to admins.
 */
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

module.exports = adminMiddleware;
