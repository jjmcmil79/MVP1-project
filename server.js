require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db/conn");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("848bbfd0fb364a2ca2fce9396844c90a");

//Middleware for parsing json data from req.body
app.use(express.json());
//Middleware to create a static page for the server to have frontend capabilities
app.use(express.static("public"));

//GET All Tasks
app.get("/api/tasks", async (_, res) => {
  try {
    await db.query("SELECT * FROM tasks ORDER BY id DESC", (error, results) => {
      // console.log(results)
      res.status(200).json(results.rows);
    });
  } catch (error) {
    console.error(error.message);
  }
});

//CREATE a Task
app.post("/api/create", async (req, res) => {
  try {
    const { task_content, due_date, completed } = req.body;
    console.log(req);
    await db.query(
      "INSERT INTO tasks (task_content, due_date, completed) VALUES ($1, $2, $3)",
      [task_content, due_date, completed],
      (error, results) => {
        console.log(req.body);
        res.status(200).send(`${req.body} task was added`);
      }
    );
  } catch (error) {
    console.error(error.message);
  }
});

//UPDATE a Task
app.put("/api/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { task_content, due_date, completed } = req.body;

    await db.query(
      "UPDATE tasks SET task_content = $1, due_date = $2, completed = $3 WHERE id = $4",
      [task_content, due_date, completed, id],
      (err, results) => {
        console.log(req.body);
        res.status(200).send(`task was added`);
      }
    );
  } catch (error) {
    console.error(error.message);
  }
});

//DELETE a Task
app.delete("/api/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM tasks WHERE id = $1", [id], (err, results) => {
      res.status(200).send(`task was deleted`);
    });
  } catch (error) {
    console.error(error.message);
  }
});

//GET top news stories from newsAPI
// To query top headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
app.get("/api/news", async (req, res) => {
  try {
    await newsapi.v2
      .topHeadlines({
        q: "",
        category: "politics",
        language: "en",
        country: "us",
      })
      .then((response) => {
        res.send(response);
      });
  } catch (error) {
    console.error(error.message);
  }
});

//Server Listening
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});

//Error handling
app.use((req, res) => {
  res.status(404).send("Not Found");
});
