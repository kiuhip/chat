import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); //req.body

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(PORT, async () => {
    console.log("Server is running on port: " + PORT);
    await connectDB();
});