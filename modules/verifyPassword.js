import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";

const verifyPassword_QUERY = "SELECT password FROM users WHERE username = $1";

const verifyPassword = async (username, password) => {
    try {
        const result = await pool.query(verifyPassword_QUERY, [username]);
        if (result.rowCount === 0) return false;

        const user = result.rows[0];
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        console.error("Database query error:", error.message);
        throw new Error("Database error");
    }
};

export default verifyPassword;
