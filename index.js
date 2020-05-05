const express = require("express");
const postsRouter = require("./posts-router.js");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json("Server Working")
})

server.use('/api/posts', postsRouter);

server.listen(4444, () => {
    console.log("\nServer Running on http://localhost:/4444");
})