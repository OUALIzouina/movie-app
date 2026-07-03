import express from "express";
import { getMovies, getMovieById, createMovie } from "../controller/movieController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", authMiddleWare, createMovie);


export default router;