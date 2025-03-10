import express from 'express';

const questRoute = express.Router();

questRoute.get('/test', (req, res) => {
    res.send("Quest assigned!");
});

questRoute.post('/assign', async (req, res) => {
    try {
        console.log("Assigned quest");
        res.json({ message: "Quest assigned successfully" });
    } catch(error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default questRoute;
