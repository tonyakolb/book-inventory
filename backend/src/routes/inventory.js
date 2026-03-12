const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title required" });
  }

  const inventory = await prisma.inventory.create({
    data: {
      title,
      description,
      creatorId: req.user.userId
    }
  });

  res.json(inventory);
});

router.get("/", async (req, res) => {
  const inventories = await prisma.inventory.findMany({
    include: {
      creator: {
        select: { id: true, name: true }
      },
      _count: {
        select: { items: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(inventories);
});

router.put('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { version } = req.body;

  if (typeof version !== "number")
    return res.status(400).json({ message: "version required" });

  const inventory = await prisma.inventory.findUnique({
    where: { id },
    select: { creatorId: true }
  });

  if (!inventory)
    return res.status(404).json({ message: "Not found" });

  if (inventory.creatorId !== req.user.userId)
    return res.status(403).json({ message: "Only creator can edit" });

  const updated = await prisma.inventory.updateMany({
    where: {
      id,
      version
    },
    data: {
      title: req.body.title,
      description: req.body.description,
      isPublic: req.body.isPublic,

      customString1Name: req.body.customString1Name,
      customString1State: req.body.customString1State,

      customInt1Name: req.body.customInt1Name,
      customInt1State: req.body.customInt1State,

      customBool1Name: req.body.customBool1Name,
      customBool1State: req.body.customBool1State,

      version: { increment: 1 }
    }
  });

  if (updated.count === 0)
    return res.status(409).json({ message: "Conflict" });

  const fresh = await prisma.inventory.findUnique({
    where: { id }
  });

  res.json(fresh);
});

router.get("/:id/stats", async (req, res) => {
  const inventoryId = Number(req.params.id);

  try {
    const totalItems = await prisma.item.count({
      where: { inventoryId }
    });

    const averageInt1 = await prisma.item.aggregate({
      where: { inventoryId },
      _avg: {
        customInt1: true
      }
    });

    const mostUsedString = await prisma.item.groupBy({
      by: ["customString1"],
      where: {
        inventoryId,
        customString1: { not: null }
      },
      _count: {
        customString1: true
      },
      orderBy: {
        _count: {
          customString1: "desc"
        }
      },
      take: 1
    });

    res.json({
      totalItems,
      averageCustomInt1: averageInt1._avg.customInt1,
      mostUsedCustomString1: mostUsedString[0]?.customString1 || null
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Stats error" });
  }
});

router.patch("/:id/public", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { isPublic, version } = req.body;

  // можно менять только владельцу
  const inv = await prisma.inventory.findUnique({ where: { id } });
  if (!inv) return res.status(404).json({ message: "Not found" });
  if (inv.creatorId !== req.user.userId) return res.status(403).json({ message: "Forbidden" });

  const updated = await prisma.inventory.updateMany({
    where: { id, version },
    data: { isPublic: !!isPublic, version: { increment: 1 } }
  });

  if (updated.count === 0) return res.status(409).json({ message: "Conflict" });

  res.json({ message: "Updated" });
});

router.get("/:id/access", auth, async (req, res) => {
  const inventoryId = Number(req.params.id);

  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId }
  });

  if (!inventory)
    return res.status(404).json({ message: "Not found" });

  if (inventory.creatorId !== req.user.userId)
    return res.status(403).json({ message: "Forbidden" });

  const accessList = await prisma.inventoryAccess.findMany({
    where: { inventoryId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.json(accessList);
});

router.post("/:id/access", auth, async (req, res) => {
  const inventoryId = Number(req.params.id);
  const { userId } = req.body;

  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId }
  });

  if (!inventory)
    return res.status(404).json({ message: "Not found" });

  if (inventory.creatorId !== req.user.userId)
    return res.status(403).json({ message: "Forbidden" });

  const access = await prisma.inventoryAccess.create({
    data: {
      inventoryId,
      userId
    }
  });

  res.json(access);
});

router.delete("/:id/access/:userId", auth, async (req, res) => {
  const inventoryId = Number(req.params.id);
  const userId = Number(req.params.userId);

  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId }
  });

  if (!inventory)
    return res.status(404).json({ message: "Not found" });

  if (inventory.creatorId !== req.user.userId)
    return res.status(403).json({ message: "Forbidden" });

  await prisma.inventoryAccess.deleteMany({
    where: {
      inventoryId,
      userId
    }
  });

  res.json({ message: "Removed" });
});

router.delete("/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  const inv = await prisma.inventory.findUnique({ where: { id } });
  if (!inv) return res.status(404).json({ message: "Not found" });

  if (inv.creatorId !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await prisma.inventory.delete({ where: { id } });
  res.json({ message: "Deleted" });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true }
      },
      _count: {
        select: { items: true }
      }
    }
  });

  if (!inventory)
    return res.status(404).json({ message: "Not found" });

  res.json(inventory);
});

module.exports = router;
