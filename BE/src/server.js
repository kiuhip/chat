import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cors from "cors";


const app = express();

const PORT = ENV.PORT || 3000;

app.use(express.json()); //req.body
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(PORT, async () => {
    console.log("Server is running on port: " + PORT);
    await connectDB();
});