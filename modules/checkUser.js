import { pool } from "../config/db.js";


const checkUser_QUERY = "SELECT 1 FROM users WHERE username = $1 LIMIT 1";

const checkUser = async (username) => {
    try {
        const result = await pool.query(checkUser_QUERY, [username]);
        return result.rowCount > 0;
    } catch (error) {
        throw new Error("Database query failed " + error);
    }
}

export default checkUser;