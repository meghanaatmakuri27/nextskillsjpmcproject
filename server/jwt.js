const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userData) => {
  // Generate a new JWT token using user data and secret from environment variables
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// Middleware to authenticate JWT token
const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  const token = authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the JWT token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { jwtAuthMiddleware, generateToken };
