import express from 'express';
import registerUser from '../modules/registerUser.js';
import loginUser from '../modules/loginUser.js';
import checkUser from '../modules/checkUser.js';

const authRoute = express.Router();

authRoute.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const message = await registerUser(username, password);
        res.status(201).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

authRoute.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const data = await loginUser(username, password);
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

authRoute.post('/checkUser', async (req, res) => {
    try {
        const { username } = req.body;
        const exists = await checkUser(username);
        res.status(200).json({ exists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default authRoute;
