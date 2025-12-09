import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 3000;

app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
app.use(express.json({limit: "5mb"})); //req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

server.listen(PORT, async () => {
    console.log("Server is running on port: " + PORT);
    await connectDB();
});