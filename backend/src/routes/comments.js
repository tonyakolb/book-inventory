const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();

// Получить комментарии по inventory (линейная лента)
router.get("/inventory/:inventoryId", async (req, res) => {
  const inventoryId = Number(req.params.inventoryId);

  const comments = await prisma.comment.findMany({
    where: { inventoryId },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.json(comments);
});

// Добавить комментарий в inventory
router.post("/inventory/:inventoryId", auth, async (req, res) => {
  const inventoryId = Number(req.params.inventoryId);
  const content = (req.body.content || "").trim();

  if (!content) return res.status(400).json({ message: "Empty comment" });

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: req.user.userId,
      inventoryId
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.json(comment);
});

module.exports = router;