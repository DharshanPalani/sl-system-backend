import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser_QUERY = "SELECT id, username, password FROM users WHERE username = $1";

const loginUser = async (username, password) => {
    try {
        const result = await pool.query(loginUser_QUERY, [username, password]);
        if (result.rowCount == 0) throw new Error("User not found");

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        const token = jwt.sign({ userID: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return { message: "Login successful!", token };
    } catch (error) {
        throw new Error("Database query failed " + error);
    }
}

export default loginUser;