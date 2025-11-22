import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if (!ENV.MONGODB_URI) {
            console.log("MONGO DB CONNECTION ERROR: MONGO_URI is not defined in .env file");
            process.exit(1);
        }
        const conn = await mongoose.connect(ENV.MONGODB_URI);
        console.log("MONGODB CONNECTED: ", conn.connection.host);
    } catch (error) {
        console.log("MONGO DB CONNECTION ERROR: ", error.message);
        process.exit(1); // 1 là lỗi, 0 là thành công 
    }
}