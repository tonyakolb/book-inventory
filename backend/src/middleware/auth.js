const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "No token" });

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true }
    });

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = {
      userId: user.id,
      role: user.role
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};