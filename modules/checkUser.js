import {db, DB_NAME} from "../config/db.js";

const checkUser = (username) => {
    return new Promise((resolve, reject) => {
        db.collection(DB_NAME).findOne({ username }, (err, result) => {
            if (err) {
                return reject(new Error("Database query failed"));
            }
            resolve(result !== null);
        });
    });
};

export default checkUser;
