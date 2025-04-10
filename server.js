import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import questRoute from "./routes/questRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/quest', questRoute); // Quest routes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
