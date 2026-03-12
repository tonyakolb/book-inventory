const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/', auth, async (req, res) => {
  try {
    const inventoryId = Number(req.body.inventoryId);
    const customId = req.body.customId;

    if (!customId) {
      return res.status(400).json({ message: "customId required" });
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: { creatorId: true, isPublic: true }
    });

    if (!inventory) return res.status(404).json({ message: "Inventory not found" });

    const access = await prisma.inventoryAccess.findFirst({
      where: {
        inventoryId,
        userId: req.user.userId
      }
    });

    const isOwner = inventory.creatorId === req.user.userId;
    const hasAccess = !!access;

    const canWrite = inventory.isPublic || isOwner || hasAccess;

    if (!canWrite)
      return res.status(403).json({ message: "No write access" });

    const item = await prisma.item.create({
      data: {
        inventoryId,
        customId,
        customString1: req.body.customString1 ?? null,
        customInt1:
          typeof req.body.customInt1 === "number"
            ? req.body.customInt1
            : null,
        customBool1:
          typeof req.body.customBool1 === "boolean"
            ? req.body.customBool1
            : null,
        createdById: req.user.userId
      }
    });
    res.json(item);
  } catch (error) {
    console.log("REAL ERROR:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Duplicate customId" });
    }

    res.status(500).json({ message: "Error creating item" });
  }
});

router.get("/", async (req, res) => {
  const inventoryId = Number(req.query.inventoryId);

  if (!inventoryId)
    return res.status(400).json({ message: "inventoryId required" });

  const items = await prisma.item.findMany({
    where: { inventoryId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { likes: true }
      }
    }
  });

  res.json(items);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const item = await prisma.item.findUnique({
    where: { id }
  });

  if (!item)
    return res.status(404).json({ message: "Not found" });

  res.json(item);
});

router.put("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  const {
    customId,
    customString1,
    customInt1,
    customBool1,
    version
  } = req.body;

  if (typeof version !== "number") {
    return res.status(400).json({ message: "version is required (number)" });
  }

  // 1) находим item
  const item = await prisma.item.findUnique({
    where: { id },
    select: { inventoryId: true }
  });
  if (!item) return res.status(404).json({ message: "Item not found" });

  // 2) проверяем доступ на inventory
  const inventory = await prisma.inventory.findUnique({
    where: { id: item.inventoryId },
    select: { creatorId: true, isPublic: true }
  });
  if (!inventory) return res.status(404).json({ message: "Inventory not found" });

  const access = await prisma.inventoryAccess.findFirst({
    where: { inventoryId: item.inventoryId, userId: req.user.userId }
  });

  const isOwner = inventory.creatorId === req.user.userId;
  const hasAccess = !!access;
  const canWrite = inventory.isPublic || isOwner || hasAccess;

  if (!canWrite) return res.status(403).json({ message: "No write access" });

  // 3) optimistic locking: обновляем только если version совпал
  const updated = await prisma.item.updateMany({
    where: { id, version },
    data: {
      customId: customId ?? undefined,
      customString1: customString1 ?? null,
      customInt1: customInt1 ?? null,
      customBool1: customBool1 ?? null,
      version: { increment: 1 }
    }
  });

  if (updated.count === 0) {
    return res.status(409).json({ message: "Conflict" });
  }

  // 4) вернем обновленную запись (удобно для фронта)
  const fresh = await prisma.item.findUnique({ where: { id } });
  res.json(fresh);
});

router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  const item = await prisma.item.findUnique({
    where: { id },
    select: { inventoryId: true }
  });
  if (!item) return res.status(404).json({ message: "Item not found" });

  const inventory = await prisma.inventory.findUnique({
    where: { id: item.inventoryId },
    select: { creatorId: true, isPublic: true }
  });
  if (!inventory) return res.status(404).json({ message: "Inventory not found" });

  const access = await prisma.inventoryAccess.findFirst({
    where: { inventoryId: item.inventoryId, userId: req.user.userId }
  });

  const isOwner = inventory.creatorId === req.user.userId;
  const hasAccess = !!access;
  const canWrite = inventory.isPublic || isOwner || hasAccess;

  if (!canWrite) return res.status(403).json({ message: "No write access" });

  await prisma.item.delete({ where: { id } });
  res.json({ message: "Deleted" });
});

module.exports = router;
