import express from "express";
import { addWatchList,getWatchlist, removeFromWatchlist, updateWatchlistItem } from "../controller/watchListController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { validatRequest } from "../middleware/validatRequest.js";
import { addWatchListSchema } from "../validators/watchListValidator.js";
const router = express.Router()
router.use(authMiddleWare)
router.post("/",validatRequest(addWatchListSchema),addWatchList)
router.put("/:id",updateWatchlistItem)
router.get("/", getWatchlist);
router.delete("/:movieId",removeFromWatchlist)



export default router
