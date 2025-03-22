import { pool } from "../config/db.js";

const storeUser_QUERY = "INSERT INTO users (username, password) value ($1, $2)";

const storeUser = async (username, hashedPassword) => {
    try {
        await pool.query(storeUser_QUERY, [username, hashedPassword]);
        return "User successfully stored";
    } catch (error) {
        throw new Error("Failed to register " + error);
    }

};

export default storeUser;
