import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getMyGroups, addMember, removeMember } from "../controller/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getMyGroups);
router.put("/:groupId/add", protectRoute, addMember);
router.put("/:groupId/remove", protectRoute, removeMember);

export default router;
