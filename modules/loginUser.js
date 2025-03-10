import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.collection("userDetails").findOne({ username }, async (err, user) => {
            if (err) return reject(err);
            if (!user) return reject(new Error('User not found'));

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject(new Error('Invalid password'));

            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            resolve({ message: 'Login successful', token });
        });
    });
};

export default loginUser;
