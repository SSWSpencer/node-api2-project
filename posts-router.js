const express = require("express");

const Data = require("./data/db.js");

const router = express.Router();

router.post("/", (req, res) =>{ 
    if(req.body.title && req.body.contents){
        const newPost = {
            title: req.body.title,
            contents: req.body.contents
        }
        Data.insert(newPost)
        .then(post =>{
            res.status(201).json(newPost)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({errorMessage: "There was an error while saving the post to the database"})
        })
    }
    else(
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    )
} )

router.post('/:id/comments', (req, res) => { 
    Data.findById(req.params.id)
    .then(post => {
        if(post[0].id) {
            if(req.body.text){
                const newComment = {
                    text: req.body.text,
                    post_id: req.params.id
                }
                Data.insertComment(newComment)
                .then(comment => {
                    res.status(201).json(newComment)
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).json({error: "There was an error while saving the comment to the database"})
                })
            }
        }
        else{
            res.status(404).json({message: "The post with the specified ID does not exist"});
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({message:"Error retrieving the post"});
    })
    
})

router.get("/", (req, res) => {
    Data.find(req.query)
    .then(data=>{
        res.status(200).json(data);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "The posts information could not be retrieved"
        })
    })
})

router.get("/:id", (req, res) => {
    Data.findById(req.params.id)
    .then(post => {
        if(post[0].id) {
            res.status(200).json(post);
        }
        else{
            res.status(404).json({message: "The post with the specified ID does not exist."});
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({message:"The post information could not be retrieved"});
    })
})

router.get("/:id/comments", (req, res) =>{ 
    Data.findById(req.params.id)
    .then(post => {
        if(post[0].id) {
            Data.findPostComments(req.params.id)
            .then(comments =>{
            res.status(200).json(comments)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: "The comments information could not be retrieved"})
            })
        }
        else{
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({message:"The comments information could not be retrieved"});
    })
})

router.delete('/:id', (req, res) => {
    let deletedPost = "";
    Data.findById(req.params.id)
    .then(post => {
        if(post[0].id) {
            deletedPost = post;
        }
        else{
            res.status(404).json({message: "Post not found"});
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({message:"Error retrieving the post"});
    })
    Data.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json(deletedPost)
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the post',
      });
    });
  });

router.put("/:id", (req, res)=>{
    Data.findById(req.params.id)
    .then(post => {
        if(post[0].id) {
            if(req.body.title && req.body.contents){
                const modifiedPost = {
                    title: req.body.title,
                    contents: req.body.contents
                }
                Data.update(parseInt(req.params.id), modifiedPost)
                .then(post => {
                    res.status(200).json(modifiedPost)
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).json({message: "There was an error modifying the post"})
                })
            }
            else{
                res.status(400).json({message: "Please provide title and contents for the post"})
            }
        }
        else{
            res.status(404).json({message: "The post with the specified ID does not exist."});
        }
    })
    .catch(err=> {
        console.log(err)
        res.status(500).json({message:"The post information could not be modified"});
    })
})

module.exports = router;



