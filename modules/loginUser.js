import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM userDetails WHERE username = ?', [username], async (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('User not found'));

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) return reject(new Error('Invalid password'));

            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            resolve({ message: 'Login successful', token });
        });
    });
};

export default loginUser;
