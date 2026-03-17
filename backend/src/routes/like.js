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

  if (existing) {
    await prisma.like.delete({
      where: {
        id: existing.id
      }
    });

    return res.json({ liked: false });
  }

  const like = await prisma.like.create({
    data: {
      itemId,
      userId: req.user.userId
    }
  });

  res.json({ message: "Liked", like });
});

module.exports = router;