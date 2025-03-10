import db from '../config/db.js';

const storeUser = (username, hashedPassword) => {
    return new Promise((resolve, reject) => {
        db.collection("userDetails").insertOne({ username, password: hashedPassword }, (err, result) => {
            if (err) {
                console.error("MongoDB Insert Error:", err.message);
                return reject(new Error("Failed to register user"));
            }
            resolve("User successfully registered.");
        });
    });
};

export default storeUser;
