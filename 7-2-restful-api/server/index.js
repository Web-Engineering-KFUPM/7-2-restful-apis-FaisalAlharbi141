import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);

// api/songs (Read all songs)
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs.map(s => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      year: s.year
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});


// api/songs (Insert song)


// /api/songs/:id (Update song)
app.put("/api/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, year } = req.body;
    const updated = await Song.findByIdAndUpdate(
      id,
      { title, artist, year },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Song not found" });
    res.json({
      id: updated._id,
      title: updated.title,
      artist: updated.artist,
      year: updated.year
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update song" });
  }
});

// /api/songs/:id (Delete song)
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Song.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete song" });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
