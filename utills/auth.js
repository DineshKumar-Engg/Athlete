const jwt = require("jsonwebtoken");
exports.authorization = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    console.log("decodedUser", decodedUser);

    if (decodedUser) {
      req.user = decodedUser;
      next();
    } else {
      return res.status(401).json({ status: 401, message: "Invalid User" });
    }
  } catch (error) {
    console.error("Authenticate error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ status: 401, message: "Token has expired", expiredAt: error.expiredAt });
    }
    return res.status(401).json({ status: 401, message: "invalid user" });
  }
};
