require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const express = require("express");
const app = express();
const Task = require("./models/Task");

const PORT = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// GET one task by id
app.get("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

// POST create a new task
app.post("/api/tasks", async (req, res) => {
  const task = await Task.create({ title: req.body.title });
  res.status(201).json(task);
});

// PUT update an existing task
app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
});

// DELETE a task
app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));