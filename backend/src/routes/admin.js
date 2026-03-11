const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const prisma = new PrismaClient();

router.use(auth);
router.use(adminOnly);

// GET all users
router.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });

    res.json(users);
});

// Toggle role
router.patch("/users/:id/role", async (req, res) => {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user)
        return res.status(404).json({ message: "Not found" });

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updated = await prisma.user.update({
        where: { id },
        data: { role: newRole }
    });

    res.json(updated);
});

// Delete user
router.delete("/users/:id", async (req, res) => {
    const id = Number(req.params.id);

    await prisma.user.delete({
        where: { id }
    });

    res.json({ message: "Deleted" });
});

module.exports = router;