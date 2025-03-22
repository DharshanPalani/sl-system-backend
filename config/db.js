import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false,
    }
});

export { pool };
