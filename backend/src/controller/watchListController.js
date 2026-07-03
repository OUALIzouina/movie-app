import { prisma } from "../config/db.js";


const getWatchlist = async (req, res) => {
    try {
      const watchlist = await prisma.watchlistItem.findMany({
        where: { userId: req.user.id },
        include: { movie: true }, 
      });
   
      res.status(200).json({
        status: "success",
        data: { watchlist },
      });
    } catch (error) {
      console.error("Get watchlist error:", error);
      res.status(500).json({ error: error.message, code: error.code });
    }
  };

const addWatchList = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;
// Verify movie exists
const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // CHeck if already added
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already in the watchlist" });
  }
const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchlistItem,
    },
  });
};




//update watchlist 

const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;
  
    // Find watchlist item and verify ownership
    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: { id: req.params.id },
    });
  
    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }
  
    // Ensure only owner can update
    if (watchlistItem.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this watchlist item" });
    }
  
    // Build update data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
  
    // Update watchlist item
    const updatedItem = await prisma.watchlistItem.update({
      where: { id: req.params.id },
      data: updateData,
    });
  
    res.status(200).json({
      status: "success",
      data: {
        watchlistItem: updatedItem,
      },
    });
  };
  



//delete from watchlist
const removeFromWatchlist = async (req, res) => {
    // Find by (userId, movieId) — the unique compound key on WatchlistItem 
    const watchlistItem = await prisma.watchlistItem.findFirst({
      where: {
        userId: req.user.id,
        movieId: req.params.movieId,
      },
    });
  
    if (!watchlistItem) {
      return res.status(404).json({ error: "Watchlist item not found" });
    }
  
    await prisma.watchlistItem.delete({
      where: { id: watchlistItem.id },
    });
  
    res.status(200).json({
      status: "success",
      message: "Movie removed from watchlist",
    });
  };

export {addWatchList,removeFromWatchlist,updateWatchlistItem,getWatchlist};