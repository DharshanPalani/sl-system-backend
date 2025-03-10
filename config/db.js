import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!mongoURI) {
    throw new Error("MONGO_URI is not defined. Check your .env file.");
}

const client = new MongoClient(mongoURI);

const connectDB = async () => {
    try {
        await client.connect();
        console.log("MongoDB Connected");
        return client.db(dbName);
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export default connectDB;
