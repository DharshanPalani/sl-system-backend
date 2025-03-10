import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🔥 Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
});
