import express from "express";
import { logout,login, register, getMe } from "../controller/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
const router = express.Router()
router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me", authMiddleWare, getMe);

export default router
