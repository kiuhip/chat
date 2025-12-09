import express from "express";
import { signup, login, logout, updateProfile, updatePassword } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", arcjetProtection, signup);

router.post("/login", arcjetProtection, login);

router.post("/logout", arcjetProtection, logout);

router.put("/update-profile", arcjetProtection, protectRoute, updateProfile);

router.put("/update-password", arcjetProtection, protectRoute, updatePassword);

router.get("/check", arcjetProtection, protectRoute, (req, res) => res.status(200).json(req.user));

export default router;