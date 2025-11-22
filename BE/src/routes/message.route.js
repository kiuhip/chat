import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { arjectProtection } from "../middleware/role.middleware";
import { getAllContacts, getChatPartners, getMessageByUserId, sendMessage } from "../controller/message.controller";

const router = express.Router();

router.use(arjectProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chat", getChatPartners);
router.get("/:id", getMessageByUserId);
router.get("/send/:id", sendMessage);

export default router;