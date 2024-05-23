const express = require('express');
const { getPosts, getUsers } = require('./services');
require("dotenv").config();

const app = express();


app.get('/', (req, res) => {
    res.send("hello world");
})

app.get('/users', (req, res) => {
    getUsers()
        .then((response) => {
            res.status(200).send(response.data.slice(0, 20))
        })
        .catch((error) => {
            res.status(400).send('Not Found')
        })
})

app.get('/users/:id/posts', async (req, res) => {
    const { id } = req.params
    getPosts()
        .then((response) => {
            res.status(200).send(response.data.filter(post => post.userId == id))
        })
        .catch((error) => {
            res.status(400).send('Not Found')
        })
})





app.listen(process.env.PORT, () => {
    console.log("listening on port :", process.env.PORT);
})