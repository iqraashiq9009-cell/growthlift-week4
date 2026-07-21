const express = require("express");
const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// In-memory data
let tasks = [
  { id: 1, title: "Learn Express", done: false },
  { id: 2, title: "Build REST API", done: false },
];

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET one task by id
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// POST create a new task
app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    done: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update an existing task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Not found" });
  task.title = req.body.title;
  task.done = req.body.done;
  res.json(task);
});

// DELETE a task
app.delete("/api/tasks/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));