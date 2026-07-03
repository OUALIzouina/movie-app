import { prisma } from "../config/db.js";

// GET /movies — supports ?search=<title text> and ?genre=<one genre>
const getMovies = async (req, res) => {
  try {
    const { search, genre } = req.query;

    const where = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (genre) {
      // genres is a String[] on Movie — `has` checks the array contains this value
      where.genres = {
        has: genre,
      };
    }

    const movies = await prisma.movie.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      data: { movies },
    });
  } catch (error) {
    console.error("Get movies error:", error);
    res.status(500).json({ error: error.message, code: error.code });
  }
};

// GET /movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: req.params.id },
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    console.error("Get movie error:", error);
    res.status(500).json({ error: error.message, code: error.code });
  }
};

// POST /movies — not required by the frontend spec, but included since
// `createdBy` is required on your schema and something has to populate it.
// Protect this route with authMiddleWare so req.user exists.
const createMovie = async (req, res) => {
  try {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

    if (!title || !releaseYear) {
      return res.status(400).json({ error: "title and releaseYear are required" });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseYear,
        genres: genres ?? [],
        runtime,
        posterUrl,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({
      status: "success",
      data: { movie },
    });
  } catch (error) {
    console.error("Create movie error:", error);
    res.status(500).json({ error: error.message, code: error.code });
  }
};

export { getMovies, getMovieById, createMovie };