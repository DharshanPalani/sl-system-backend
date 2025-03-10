import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
    const db = await connectDB();
    app.locals.db = db;

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
