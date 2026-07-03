// scripts/seedMovies.js
// One-time (or re-run anytime) script to populate the Movie table from TMDB.
//
// Setup:
//   1. Get a free API key: https://www.themoviedb.org/settings/api
//   2. Add to your .env:  TMDB_API_KEY=your_key_here
//   3. Run:  node scripts/seedMovies.js
//
// Requires Node 18+ (uses the built-in global fetch — no extra install needed).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

// How many pages of "popular" movies to pull — TMDB returns 20 per page.
const PAGES_TO_FETCH = 3;

if (!TMDB_API_KEY) {
  console.error("Missing TMDB_API_KEY in your .env file.");
  process.exit(1);
}

async function tmdbGet(path) {
  const res = await fetch(`${TMDB_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`);
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText} (${path})`);
  }
  return res.json();
}

async function getOrCreateSeedUser() {
  const email = "seed-bot@internal.local";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const hashedPassword = await bcrypt.hash("not-a-real-login-" + Date.now(), 10);
  return prisma.user.create({
    data: {
      name: "Seed Bot",
      email,
      password: hashedPassword,
    },
  });
}

async function main() {
  console.log("Fetching genre list...");
  const genreData = await tmdbGet("/genre/movie/list");
  const genreMap = Object.fromEntries(genreData.genres.map((g) => [g.id, g.name]));

  const seedUser = await getOrCreateSeedUser();
  console.log(`Seeding movies as user: ${seedUser.email} (${seedUser.id})`);

  let created = 0;
  let skipped = 0;

  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    console.log(`Fetching popular movies — page ${page}...`);
    const data = await tmdbGet(`/movie/popular?page=${page}`);

    for (const item of data.results) {
      const existing = await prisma.movie.findFirst({ where: { title: item.title } });
      if (existing) {
        skipped++;
        continue;
      }

      // Fetch runtime separately — the popular-list endpoint doesn't include it.
      let runtime = null;
      try {
        const details = await tmdbGet(`/movie/${item.id}`);
        runtime = details.runtime ?? null;
      } catch {
        // Non-fatal — just leave runtime null for this one.
      }

      await prisma.movie.create({
        data: {
          title: item.title,
          overview: item.overview || null,
          releaseYear: item.release_date ? parseInt(item.release_date.slice(0, 4), 10) : new Date().getFullYear(),
          genres: (item.genre_ids || []).map((id) => genreMap[id]).filter(Boolean),
          runtime,
          posterUrl: item.poster_path ? `${POSTER_BASE}${item.poster_path}` : null,
          createdBy: seedUser.id,
        },
      });
      created++;
    }
  }

  console.log(`Done. Created ${created} movies, skipped ${skipped} already-existing titles.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());