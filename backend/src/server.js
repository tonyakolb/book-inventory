require('dotenv').config();
const express = require('express'); //server - http-requests
const cors = require('cors'); // unit frontend + backend
const { PrismaClient } = require('@prisma/client'); // orm client
const auth = require('./middleware/auth');
const passport = require("./oauth/passport");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/inventories', require('./routes/inventory'));
app.use('/items', require('./routes/item'));
app.use('/comments', require('./routes/comments'));
app.use('/likes', require('./routes/like'));
app.use("/admin", require("./routes/admin"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({ message: 'Book Inventory API is running' });
});

// Создание пользователя
app.post('/users', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name
      }
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'User creation failed' });
  }
});

// Получить всех пользователей
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();

  if (!q) return res.json([]);

  try {
    const results = await prisma.$queryRaw`
      SELECT id, title, description, 'inventory' AS type
      FROM "Inventory"
      WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'')) 
      @@ plainto_tsquery('english', ${q})

      UNION ALL

      SELECT id, "customId" AS title, "customString1" AS description, 'item' AS type
      FROM "Item"
      WHERE to_tsvector('english', coalesce("customId",'') || ' ' || coalesce("customString1",''))
      @@ plainto_tsquery('english', ${q})

      LIMIT 20
    `;

    res.json(results);

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Search error" });
  }
});

app.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { 
      id: true, 
      name: true, 
      email: true,
      role: true
    }
  });

  res.json(user);
});

const FRONTEND_OAUTH_REDIRECT =
  process.env.FRONTEND_OAUTH_REDIRECT || "http://localhost:5173/oauth";

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: true, failureRedirect: "/auth/oauth-failed" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_OAUTH_REDIRECT}?token=${token}`);
  }
);

app.get("/auth/github",
  passport.authenticate("github")
);

app.get("/auth/github/callback",
  passport.authenticate("github", { session: true, failureRedirect: "/auth/oauth-failed" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_OAUTH_REDIRECT}?token=${token}`);
  }
);

app.get("/auth/oauth-failed", (req, res) => {
  res.status(401).send("OAuth failed");
});