const express = require("express");
const postsRouter = require("./posts-router.js");

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json("Server Working")
})

server.use('/api/posts', postsRouter);

const port = process.env.PORT || 4444;
server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
