import express from 'express';
import { connectDB } from '../config/db';

const questRoute = express.Router();
const db = await connectDB();
const quests = db.collection("quests");

questRoute.get('/raw', async (req, res) => {
    try {
        const quest_data = await quests.find().toArray();
        res.json(quest_data);
    } catch(error) {
        res.send(error)
    }
});

questRoute.get('/assign', async (req, res) => {
    try {
        const randomQuest = await quests.aggregate([{ $sample: { size: 1 } }]).toArray();

        const quest = randomQuest[0];
        
        res.json({quest_id: quest._id})

    } catch (error) {
        console.error("Error assigning quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

questRoute.post('/add', async (req, res) => {
    const { quest_name, reward_point, rank, details } = req.body;

    const newQuest = {
        quest_name,
        reward_point,
        rank,
        details
    };

    try {
        const db = await connectDB();
        const quests = db.collection('quests');

        const result = await quests.insertOne(newQuest);
        res.status(201).json({
            _id: result.insertedId,
            message: "Quest added successfully"
        });
    } catch (error) {
        console.error("Error adding quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




export default questRoute;
