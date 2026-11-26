const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

let posts = [];
let comments = [];
let nextPostId = 1;
let nextCommentId = 1;

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.get("/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.status(200).json(post);
});

app.post("/posts", (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: "name and content are required" });
  }

  const newPost = {
    id: nextPostId++,
    name,
    content,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.get("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const postComments = comments.filter((c) => c.postId === postId);
  res.status(200).json(postComments);
});

app.post("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: "comment is required" });
  }

  const newComment = {
    id: nextCommentId++,
    postId,
    comment,
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});