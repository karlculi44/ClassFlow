import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};
export default verifyToken;
