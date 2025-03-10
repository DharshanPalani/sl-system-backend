import bcrypt from 'bcrypt';
import {db, DB_NAME} from '../config/db.js';

const verifyPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        db.collection(DB_NAME).findOne({ username }, (err, user) => {
            if (err) {
                console.error("MongoDB Query Error:", err.message);
                return reject(new Error("Database error"));
            }

            if (!user) {
                return resolve(false);
            }

            resolve(bcrypt.compareSync(password, user.password));
        });
    });
};

export default verifyPassword;
