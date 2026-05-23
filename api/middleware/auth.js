import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  

  console.log("Received Token:", token);  
  if (!token) {
    return res.status(403).json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = decoded;  
    next();  
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
