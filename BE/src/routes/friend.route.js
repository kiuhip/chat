import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    getFriends,
    getSuggestions
} from "../controller/friend.controller.js";

const router = express.Router();

router.post("/request/:id", protectRoute, sendFriendRequest);
router.put("/accept/:requestId", protectRoute, acceptFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.get("/friends", protectRoute, getFriends);
router.get("/suggestions", protectRoute, getSuggestions);

export default router;
