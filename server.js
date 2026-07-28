require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const Task = require("./models/Task");
const authRoutes = require("./routes/auth");
const protect = require("./middleware/auth");

app.use(helmet());
app.use(cors());

const PORT = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/api/auth", authRoutes);

// GET all tasks
app.get("/api/tasks", protect, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: "Invalid request" });
  }
});

// GET one task by id
app.get("/api/tasks/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// POST create a new task
app.post("/api/tasks", protect, async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const task = await Task.create({ title: req.body.title });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Invalid request" });
  }
});

// PUT update an existing task
app.put("/api/tasks/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// DELETE a task
app.delete("/api/tasks/:id", protect, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: "Invalid ID format" });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));