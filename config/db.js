import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

export const DB_NAME = 'users';

if (!mongoURI) {
    throw new Error("MONGO_URI is not defined. Check your .env file.");
}

const client = new MongoClient(mongoURI);
let db;

const connectDB = async () => {
    try {
        if (!db) {
            await client.connect();
            console.log("MongoDB Connected");
            db = client.db(dbName);
        }
        return db;
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export { connectDB, db };
