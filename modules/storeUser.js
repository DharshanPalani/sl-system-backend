import db from '../config/db.js';

const storeUser = (username, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO userDetails (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
            if (err) {
                console.error("MySQL Insert Error:", err.message);
                return reject(new Error("Failed to register user"));
            }
            resolve("User successfully registered.");
        });
    });
};

export default storeUser;
