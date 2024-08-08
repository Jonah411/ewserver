const jwt = require("jsonwebtoken");
const secret = process.env.SECRET; // Ensure this matches the environment variable in your .env file

const authMiddleware = (req, res, next) => {
  // Check for the Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Extract the token by removing "Bearer " from the authHeader
  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, send a 401 response
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
