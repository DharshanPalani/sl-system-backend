import bcrypt from 'bcrypt';
import db from '../config/db.js';

const verifyPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT password FROM userDetails WHERE username = ?", [username], (err, results) => {
            if (err) {
                console.error("MySQL Query Error:", err.message);
                return reject(new Error("Database error"));
            }

            if (!results || results.length === 0) {
                return resolve(false);
            }

            const hashedPassword = results[0].password;
            resolve(bcrypt.compareSync(password, hashedPassword));
        });
    });
};

export default verifyPassword;
