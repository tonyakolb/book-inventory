const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();

router.post("/:itemId", auth, async (req, res) => {
  const itemId = Number(req.params.itemId);

  const existing = await prisma.like.findFirst({
    where: {
      itemId,
      userId: req.user.userId
    }
  });

  if (existing)
    return res.status(400).json({ message: "Already liked" });

  const like = await prisma.like.create({
    data: {
      itemId,
      userId: req.user.userId
    }
  });

  res.json(like);
});

module.exports = router;