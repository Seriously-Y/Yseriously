import express from "express";
import dotenv from "dotenv";

import cors from "cors";

dotenv.config();
const express = require("express");
const { MongoClient } = require("mongodb");
const { processAudio } = require("./audioProcessor");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		})
	);
}
// MongoDB Connection
const client = new MongoClient("mongodb://localhost:27017/");
const db = client.db("audio_notes_db");
const collection = db.collection("notes");

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Middleware to parse JSON requests

// API to start recording and processing
app.get("/start_recording", async (req, res) => {
  try {
    const notes = await processAudio(); // Process audio & generate notes

    // Store notes in MongoDB
    await collection.insertOne({ notes, status: "completed" });

    res.json({ status: "Recording started", notes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch the latest notes
app.get("/get_notes", async (req, res) => {
  try {
    const latestNote = await collection.findOne({}, { sort: { _id: -1 } });

    if (latestNote) {
      res.json({ notes: latestNote.notes });
    } else {
      res.json({ error: "No notes found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});