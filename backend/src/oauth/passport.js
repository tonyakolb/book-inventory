const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertOAuthUser({ provider, oauthId, email, name }) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      oauthProvider: provider,
      oauthId
    },
    create: {
      email,
      name: name || email,
      password: "oauth", // заглушка
      oauthProvider: provider,
      oauthId
    }
  });
}

// 🔹 GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) return done(new Error("Google email missing"));

        const user = await upsertOAuthUser({
          provider: "google",
          oauthId: profile.id,
          email,
          name
        });

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

// 🔹 GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"]
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.username;

        if (!email) return done(new Error("GitHub email missing"));

        const user = await upsertOAuthUser({
          provider: "github",
          oauthId: profile.id,
          email,
          name
        });

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (e) {
    done(e);
  }
});

module.exports = passport;