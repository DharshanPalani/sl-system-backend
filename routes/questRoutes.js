import express from "express";
import { pool } from "../config/db.js";

const questRoute = express.Router();

questRoute.get("/raw", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM quests");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching quests:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

questRoute.get("/assign", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM quests ORDER BY RANDOM() LIMIT 1");
        if (result.rowCount === 0) return res.status(404).json({ error: "No quests found" });

        const quest = result.rows[0];
        res.json({ quest_id: quest.id });
    } catch (error) {
        console.error("Error assigning quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

questRoute.post("/add", async (req, res) => {
    const { quest_name, reward_point, rank, details } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO quests (quest_name, reward_point, rank, details) VALUES ($1, $2, $3, $4) RETURNING id",
            [quest_name, reward_point, rank, details]
        );

        res.status(201).json({
            _id: result.rows[0].id,
            message: "Quest added successfully",
        });
    } catch (error) {
        console.error("Error adding quest:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default questRoute;
