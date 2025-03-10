import db from '../config/db.js';

const checkUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM userDetails WHERE username = ?", [username], (err, results) => {
            if (err) {
                console.error("MySQL Query Error:", err.message);
                return reject(new Error("Database query failed"));
            }
            resolve(results && results.length > 0);
        });
    });
};

export default checkUser;
