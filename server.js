const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "highscores.json");

app.use(cors());
app.use(express.json());

let highscores = [];
if (fs.existsSync(DATA_FILE)) {
  highscores = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

app.get("/api/highscores", (req, res) => {
  res.json(highscores);
});

app.post("/api/highscores", (req, res) => {
  const { name, score, rank } = req.body;

  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid data format" });
  }

  highscores.push({ name, score, rank, date: new Date().toISOString() });
  highscores.sort((a, b) => b.score - a.score);
  highscores = highscores.slice(0, 20);

  fs.writeFileSync(DATA_FILE, JSON.stringify(highscores, null, 2));
  res.json({ message: "Score saved" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
