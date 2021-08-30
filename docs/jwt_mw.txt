const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "#ChangeThisPassword!");
    req.userData = {
      userName: decodedToken.UserName,
      userId: decodedToken.UserId,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed" });
  }
};
