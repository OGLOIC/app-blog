// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const moment = require("moment");

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory database for blog posts
let posts = [];

// CREATE: Add a new blog post (using async/await)
app.post("/posts", async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const newPost = {
            id: _.uniqueId("post_"),
            title,
            content,
            createdAt: moment().format("MMMM Do YYYY, h:mm:ss a")
        };

        posts.push(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Error creating post" });
    }
});

// READ: Get all blog posts (using promises)
app.get("/posts", (req, res) => {
    new Promise((resolve) => {
        resolve(posts);
    }).then(data => res.json(_.orderBy(data, ['createdAt'], ['desc'])))
    .catch(() => res.status(500).json({ error: "Error fetching posts" }));
});

// READ: Get a single blog post by ID
app.get("/posts/:id", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
});

// UPDATE: Modify an existing blog post (using async/await)
app.put("/posts/:id", async (req, res) => {
    try {
        const post = posts.find(p => p.id === req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const { title, content } = req.body;
        post.title = title || post.title;
        post.content = content || post.content;
        post.updatedAt = moment().format("MMMM Do YYYY, h:mm:ss a");

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: "Error updating post" });
    }
});

// DELETE: Remove a blog post (using async/await)
app.delete("/posts/:id", async (req, res) => {
    try {
        posts = posts.filter(p => p.id !== req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error deleting post" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
